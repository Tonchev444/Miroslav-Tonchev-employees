import { EMPLOYEES } from "../consts/emloyees";
import { PROJECTS } from "../consts/projects";

const Results = ({ data }) => {
  const topGroup = data.groups[0];
  return (
    <div className="card">
      <h4>The results are</h4>
      <p>The following employees:</p>
      <ul>
        {topGroup.map((e) => (
          <li>
            {e}: {EMPLOYEES[e]}
          </li>
        ))}
      </ul>
      <p>
        Have worked {data.maxDays} days on the "{PROJECTS[data.projectId]}"
        project togheter, witch is the longest collaboation in the company.
      </p>
    </div>
  );
};

export default Results;
