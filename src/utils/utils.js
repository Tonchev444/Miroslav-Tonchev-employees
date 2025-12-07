import {
  WRONG_CSV_FORMAT_TEXT,
  WRONG_DATE_TO_FORMAT_TEXT,
} from "../consts/consts";

export const transformToArr = async (file, setError) => {
  const text = await file.text();
  const rows = text
    .split("\n")
    .map((r) => r.trim())
    .filter((r) => r.length);
  const list = rows.map((row) => {
    const [empId, projectId, dateFrom, dateTo] = row
      .split(",")
      .map((e) => e.trim());

    if (!empId || !projectId || !dateFrom || !dateTo) {
      console.error(WRONG_CSV_FORMAT_TEXT);
      setError(WRONG_CSV_FORMAT_TEXT);
      return null;
    }

    let dateToFormated;
    let dateFromFormated;

    if (dateTo === "NULL") {
      dateToFormated = new Date();
    } else if (isValidDate(dateTo)) {
      dateToFormated = new Date(dateTo);
    } else {
      console.error(WRONG_DATE_TO_FORMAT_TEXT, dateTo);
      return null;
    }

    if (isValidDate(dateFrom)) {
      dateFromFormated = new Date(dateFrom);
    } else {
      console.error(WRONG_DATE_TO_FORMAT_TEXT, dateFrom);
      return null;
    }

    return { empId, projectId, dateFromFormated, dateToFormated };
  });
  return list;
};

export const checkForLongestCollab = (data, setTopCollabData) => {
  const msToDays = (ms) => Math.ceil(ms / (1000 * 60 * 60 * 24));

  const projects = data.reduce((acc, item) => {
    if (!acc[item.projectId]) acc[item.projectId] = [];
    acc[item.projectId].push({
      empId: item.empId,
      from: new Date(item.dateFromFormated),
      to: new Date(item.dateToFormated),
    });
    return acc;
  }, {});

  const results = {};

  Object.keys(projects).forEach((pId) => {
    const employees = projects[pId];
    const pairOverlaps = [];

    for (let i = 0; i < employees.length; i++) {
      for (let j = i + 1; j < employees.length; j++) {
        const a = employees[i];
        const b = employees[j];
        const start = new Date(Math.max(a.from, b.from));
        const end = new Date(Math.min(a.to, b.to));
        if (end > start) {
          pairOverlaps.push({
            empIds: [a.empId, b.empId],
            start,
            end,
            days: msToDays(end - start),
          });
        }
      }
    }

    if (pairOverlaps.length === 0) return;

    const maxDays = Math.max(...pairOverlaps.map((p) => p.days));

    const bestPairs = pairOverlaps.filter((p) => p.days === maxDays);

    const groups = [];
    bestPairs.forEach((p) => {
      const { start, end } = p;
      const group = employees
        .filter((e) => e.from <= start && e.to >= end)
        .map((e) => e.empId);
      groups.push([...new Set(group)]);
    });

    const uniqueGroups = [];
    groups.forEach((g) => {
      if (
        !uniqueGroups.some(
          (ug) => ug.length === g.length && ug.every((v) => g.includes(v))
        )
      ) {
        uniqueGroups.push(g);
      }
    });

    results[pId] = {
      maxDays,
      groups: uniqueGroups,
    };
  });

  let maxProjectId = null;
  let maxDays = -1;

  for (const [pId, info] of Object.entries(results)) {
    if (info.maxDays > maxDays) {
      maxDays = info.maxDays;
      maxProjectId = pId;
    }
  }

  console.log("Project with longest collaboration:", {
    projectId: maxProjectId,
    maxDays,
    groups: results[maxProjectId].groups,
  });
  setTopCollabData({
    projectId: maxProjectId,
    maxDays,
    groups: results[maxProjectId].groups,
  });
};

const isValidDate = (value) => {
  const date = unifyDate(value);
  return !isNaN(date.getTime());
};

const unifyDate = (str) => {
  if (str.includes("/")) {
    const [a, b, c] = str.split("/");
    if (a.length === 2 && b.length === 2 && c.length === 4) {
      return new Date(c, b - 1, a);
    }
  }

  if (str.includes("-")) {
    return new Date(str);
  }

  return new Date(str);
};
