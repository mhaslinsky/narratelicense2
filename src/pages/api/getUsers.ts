import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  console.log(process.env.USER);
  console.log(process.env.PASSWORD);

  try {
    const { data } = await axios.post(
      "https://healthcare.nvoq.com/SCVmcServices/rest/organizations/ZhR9-0ijbLc8wDYcKQ0zQw/reports/hgGjPIAJQPGJJvrZj_ZmPA",
      {
        startDate: "2022-03-11T00:00:00+06:00",
        endDate: "2022-03-11T23:59:59+06:00",
      },
      {
        auth: {
          username: process.env.USER!,
          password: process.env.PASSWORD!,
        },
      }
    );
    res.status(200).json(data);
  } catch (err) {
    // console.log(err);
    res.status(500).json(err);
  }
}
