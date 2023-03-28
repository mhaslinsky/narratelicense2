import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

export default async function getUsersLastActive(req: NextApiRequest, res: NextApiResponse) {
  const now = new Date();
  const threeYearsAgo = new Date(now.getFullYear() - 3, now.getMonth() + 1, now.getDate());
  console.log(threeYearsAgo);
  const endDate = now
    .toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replaceAll("/", "-");
  const startDate = threeYearsAgo
    .toLocaleString("en-US", {
      timeZone: "America/New_York",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replaceAll("/", "-");
  console.log(startDate, endDate);
  try {
    const { data } = await axios.post(
      "https://healthcare.nvoq.com/SCVmcServices/rest/organizations/ZhR9-0ijbLc8wDYcKQ0zQw/reports/XTdtukD8RJSgLu0J4tBMtw",
      {
        startDate,
        endDate,
        dateRangeFor: "useAccountCreation",
        showDeleted: false,
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
