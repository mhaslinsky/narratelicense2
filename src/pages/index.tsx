import { Stack, Title, Divider, LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { UserWithBillable, UserWithLastActive, CombinedData, UserAccountCreation } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import UserTable from "@/UserTable";

const Home: NextPage = (props) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const usersWithBillable: UserWithBillable[] = await fetch("/api/getUsers").then((res) => res.json());
        const userWithActiveDates: UserWithLastActive[] = await fetch("/api/getUsersLastActive").then((res) =>
          res.json()
        );
        const userWithCreationDates: UserAccountCreation[] = await fetch("/api/getAccountCreation").then((res) =>
          res.json()
        );
        const firstStage = usersWithBillable.map((userBillable) => {
          const matchingUser = userWithActiveDates.find(
            (userWDates) =>
              userWDates["Last name"] === userBillable["Last name"] &&
              userWDates["First name"] === userBillable["First name"]
          );
          if (matchingUser) {
            return {
              ...userBillable,
              "Last activity time": matchingUser["Last activity time"],
              "Last sign in time": matchingUser["Last sign in time"],
            };
          }
          return {
            ...userBillable,
            "Last activity time": null,
            "Last sign in time": null,
          };
        });
        const secondStage = firstStage.map((user) => {
          const matchingUser = userWithCreationDates.find(
            (userCreation) =>
              userCreation["Last name"] === user["Last name"] && userCreation["First name"] === user["First name"]
          );
          if (matchingUser) {
            return {
              ...user,
              "Creation date": matchingUser["Creation date"],
            };
          }
          return {
            ...user,
            "Creation date": "> 3 years ago",
          };
        });
        setUsers(secondStage);
        setLoading(false);
      } catch (e) {
        console.log(e);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const columnHelper = createColumnHelper<CombinedData>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => `${row["Last name"]}`, {
        header: "Last name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => `${row["First name"]}`, {
        header: "First name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => `${row["Enabled"]}`, {
        header: "Enabled",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => `${row["Non-billable"]}`, {
        header: "Non-Billable",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor((row) => `${row["Creation date"]}`, {
        header: "Created",
        cell: (info) => {
          if (info.getValue() === "> 3 years ago") return "> 3 years ago";
          const timestamp = info.getValue();
          const date = new Date(parseInt(timestamp));
          if (date.toString() === "Invalid Date") return "None Found";
          return date.toLocaleDateString();
        },
      }),
      columnHelper.accessor((row) => `${row["Last sign in time"]}`, {
        header: "Last Sign In",
        cell: (info) => {
          const timestamp = info.getValue();
          const date = new Date(parseInt(timestamp));
          if (date.toString() === "Invalid Date") return "None Found";
          return date.toLocaleDateString();
        },
      }),
      columnHelper.accessor((row) => `${row["Last activity time"]}`, {
        header: "Last Activity",
        cell: (info) => {
          const timestamp = info.getValue();
          const date = new Date(parseInt(timestamp));
          if (date.toString() === "Invalid Date") return "None Found";
          return date.toLocaleDateString();
        },
      }),
    ],
    [columnHelper]
  );

  return (
    <Stack>
      <LoadingOverlay visible={loading} />
      <UserTotals users={users || []} />
      <Divider />
      <UserTable columns={columns} loading={false} data={users} />
    </Stack>
  );
};

export default Home;

function UserTotals(props: { users: CombinedData[] }) {
  const nonBillable = props.users.filter((u) => u["Non-billable"] === 1).length;
  const enabled = props.users.filter((u) => u["Enabled"] === 1).length;
  const enabledandNonBillable = props.users.filter((u) => u["Enabled"] === 1 && u["Non-billable"] === 1).length;
  const chargeable = enabled - enabledandNonBillable;

  return (
    <Title pt={16}>
      Wayne Memorial Narrate License and Activity Info:
      <br />
      {props.users.length} users, {enabled} enabled, {nonBillable} non-billable, {enabledandNonBillable} enabled
      and non-billable. {chargeable} chargeable.
    </Title>
  );
}
