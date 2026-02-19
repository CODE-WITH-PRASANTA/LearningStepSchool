import ActionDropdown from "./Actiondropdown";

const SubjectTable = ({ subjects, onEdit, onDelete }) => {
  return (
    <div className="cc-card">
      <h3>📋 Co-Curricular Subject List</h3>

      <div className="table-scroll">
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>CODE</th>
              <th>CLASS</th>
              <th>TYPE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map(s => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.code}</td>
                <td>{s.class}</td>
                <td>{s.type}</td>
                <td>
                  <ActionDropdown
                    onEdit={() => onEdit(s)}
                    onDelete={() => onDelete(s.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubjectTable;