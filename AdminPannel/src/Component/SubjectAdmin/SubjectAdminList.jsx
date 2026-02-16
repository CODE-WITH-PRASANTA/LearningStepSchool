import SubjectActionDropdown from "./SubjectActionDropdown";

const SubjectList = ({ subjects, onEdit, onDelete }) => {
  return (
    <div className="sp-card">
      <h3 className="sp-card-title">📋 Subject List</h3>

      <div className="sp-table-wrapper">
        <table className="sp-table">
          <thead>
            <tr>
              <th>NAME</th>
              <th>TYPE</th>
              <th>CODE</th>
              <th className="sp-action-header">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((sub) => (
              <tr key={sub.id}>
                <td>{sub.name}</td>
                <td>{sub.type}</td>
                <td>{sub.code}</td>

                {/* ✅ FIXED ACTION CELL */}
                <td className="sp-action-cell">
                  <SubjectActionDropdown
                    onEdit={() => onEdit(sub)}
                    onDelete={() => onDelete(sub.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sp-pagination">
        Showing 1 to 10 of {subjects.length} entries
      </div>
    </div>
  );
};

export default SubjectList;