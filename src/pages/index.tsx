import { Stack, Title, Divider, LoadingOverlay } from "@mantine/core";
import { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { User } from "@/types/types";
import { createColumnHelper } from "@tanstack/react-table";
import UserTable from "@/UserTable";

const Home: NextPage = (props) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const users = await fetch("/api/getUsers").then((res) => res.json());
        setUsers(users);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };
    fetchUsers();
  }, []);

  const columnHelper = createColumnHelper<User>();
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

function UserTotals(props: { users: User[] }) {
  const nonBillable = props.users.filter((u) => u["Non-billable"] === 1).length;
  const enabled = props.users.filter((u) => u["Enabled"] === 1).length;
  const enabledandNonBillable = props.users.filter((u) => u["Enabled"] === 1 && u["Non-billable"] === 1).length;
  const chargeable = enabled - enabledandNonBillable;

  return (
    <Title>
      {props.users.length} users, {enabled} enabled, {nonBillable} non-billable, {enabledandNonBillable} enabled
      and non-billable. {chargeable} chargeable.
    </Title>
  );
}
