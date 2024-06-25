import { faEye, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ProjectReports() {
  return (
    <div className="col-12 p-3">
      <h4 className="col-12 text-white">Reports</h4>
      <table className="table table-dark table-bordered table-hover">
        <thead>
          <tr>
            <th>-</th>
            <th>Report Name</th>
            <th>Report View</th>
            <th>Report Print</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Full Project Progress</td>
            <td>
              <FontAwesomeIcon icon={faEye} />
            </td>
            <td>
              <FontAwesomeIcon icon={faPrint} />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
