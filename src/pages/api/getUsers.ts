import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getUsers(req: NextApiRequest, res: NextApiResponse) {
  const currentDate = new Date();
  const startDate = currentDate.toISOString().slice(0, 10) + "T00:00:00+00:00";
  const endDate = currentDate.toISOString().slice(0, 10) + "T23:59:59+06:00";
  try {
    const { data } = await axios.post(
      "https://healthcare.nvoq.com/SCVmcServices/rest/organizations/ZhR9-0ijbLc8wDYcKQ0zQw/reports/hgGjPIAJQPGJJvrZj_ZmPA",
      {
        startDate,
        endDate,
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
