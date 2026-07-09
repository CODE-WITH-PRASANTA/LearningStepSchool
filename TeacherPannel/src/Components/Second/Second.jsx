import React, { useState } from 'react';
import './Second.css';

const Second = () => {
  // Mock Data for Team Members
  const teamMembers = [
    { id: 1, name: 'Mr. Jay Soni', role: 'Manager', status: 'Available', avatar: '👨‍💼' },
    { id: 2, name: 'Ms. Sarah Smith', role: 'Developer', status: 'Absent', avatar: '👩‍💻' },
    { id: 3, name: 'Ms. Megha Trivedi', role: 'Tester', status: 'Available', avatar: '👩‍💼' },
    { id: 4, name: 'Mr. John Deo', role: 'Designer', status: 'Available', avatar: '👨‍🎨' },
    { id: 5, name: 'Mr. Jacob Ryan', role: 'Developer', status: 'Absent', avatar: '👨‍💻' },
    { id: 6, name: 'Mr. Jay Soni', role: 'Team Leader', status: 'Available', avatar: '🧑‍💼' },
    { id: 7, name: 'Ms. Linda Carter', role: 'HR', status: 'Available', avatar: '👩‍💼' },
  ];

  // Mock Data for Tasks Table
  const tasks = [
    { id: 1, task: 'Task A', status: 'Not Started', manager: 'Jay Soni', progress: 30 },
    { id: 2, task: 'Task B', status: 'Completed', manager: 'Sarah Smith', progress: 100 },
    { id: 3, task: 'Task C', status: 'In Progress', manager: 'Megha Trivedi', progress: 65 },
    { id: 4, task: 'Task D', status: 'Pending', manager: 'Jacob Ryan', progress: 85 },
    { id: 5, task: 'Task E', status: 'In Progress', manager: 'Airi Satou', progress: 70 },
    { id: 6, task: 'Task A', status: 'Not Started', manager: 'Angelica Ramos', progress: 40 },
    { id: 7, task: 'Task B', status: 'Completed', manager: 'Ashton Cox', progress: 100 },
  ];

  // Interactive State for Todo List Items
  const [todos, setTodos] = useState([
    { id: 1, text: 'Buy groceries', priority: 'Normal', checked: false },
    { id: 2, text: 'Finish project report', priority: 'High', checked: false },
    { id: 3, text: 'Clean the house', priority: 'Low', checked: true },
    { id: 4, text: 'Call the bank', priority: 'Normal', checked: false },
    { id: 5, text: 'Read a book', priority: 'Low', checked: false },
    { id: 6, text: 'Schedule doctor appoint...', priority: 'High', checked: false },
    { id: 7, text: 'Prepare for presentation', priority: 'Normal', checked: false },
  ]);

  const handleTodoToggle = (id) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, checked: !todo.checked } : todo
      )
    );
  };

  return (
    <div className="dashboard-extended">
      
      {/* SECTION 1: Team & Tasks Rows */}
      <div className="dashboard-extended__row dashboard-extended__row--top">
        
        {/* Left Card: My Team Panel */}
        <section className="dashboard-panel panel-team">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">My Team</h3>
            <span className="dashboard-panel__view-all">View All</span>
          </div>
          
          <div className="panel-team__table-header">
            <span>Employee Name</span>
            <span>Status</span>
          </div>

          <div className="panel-team__scrollable-list">
            {teamMembers.map(member => (
              <div key={member.id} className="team-item">
                <div className="team-item__profile">
                  <div className="team-item__avatar">{member.avatar}</div>
                  <div className="team-item__details">
                    <h4 className="team-item__name">{member.name}</h4>
                    <span className="team-item__role">{member.role}</span>
                  </div>
                </div>
                <span className={`status-badge status-badge--${member.status.toLowerCase()}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Right Card: My Tasks Panel */}
        <section className="dashboard-panel panel-tasks">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">My Task</h3>
            <span className="dashboard-panel__view-all">View All</span>
          </div>

          <div className="panel-tasks__table-wrapper">
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Manager</th>
                  <th>Progress</th>
                  <th>Documents</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td className="tasks-table__bold">{task.task}</td>
                    <td>
                      <span className={`task-badge task-badge--${task.status.replace(/\s+/g, '-').toLowerCase()}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{task.manager}</td>
                    <td>
                      <div className="tasks-table__progress-container">
                        <div className="tasks-table__progress-bar" style={{ width: `${task.progress}%` }}></div>
                      </div>
                    </td>
                    <td className="tasks-table__icon-cell">📄</td>
                    <td className="tasks-table__link-cell">Details</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* SECTION 2: Todo, Status, & Tickets Charts Row */}
      <div className="dashboard-extended__row dashboard-extended__row--bottom">
        
        {/* Panel A: Todo List Dashboard Card */}
        <section className="dashboard-panel panel-todo">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">Todo List</h3>
            <span className="dashboard-panel__view-all">View All</span>
          </div>

          <div className="panel-todo__scrollable-container">
            {todos.map(todo => (
              <div key={todo.id} className={`todo-item ${todo.checked ? 'todo-item--completed' : ''}`}>
                <div className="todo-item__drag-handle">⋮⋮</div>
                <label className="todo-item__checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={todo.checked} 
                    onChange={() => handleTodoToggle(todo.id)}
                    className="todo-item__native-checkbox"
                  />
                  <span className="todo-item__custom-box"></span>
                  <span className="todo-item__text">{todo.text}</span>
                </label>
                <span className={`todo-item__priority todo-item__priority--${todo.priority.toLowerCase()}`}>
                  {todo.priority === 'High' && '↑ '}
                  {todo.priority === 'Low' && '↓ '}
                  {todo.priority === 'Normal' && '— '}
                  {todo.priority}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Panel B: Ticket Status Radial Arc Card */}
        <section className="dashboard-panel panel-ticket-status">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">Ticket Status</h3>
            <span className="dashboard-panel__view-all">View All</span>
          </div>

          <div className="ticket-gauge">
            <div className="ticket-gauge__container">
              <svg viewBox="0 0 100 100" className="ticket-gauge__svg">
                {/* Gray background track base arch */}
                <circle cx="50" cy="50" r="40" className="ticket-gauge__bg" />
                {/* Dash Segmented Blue Arc Layer */}
                <circle cx="50" cy="50" r="40" className="ticket-gauge__fill" />
              </svg>
              <div className="ticket-gauge__center">
                <span className="ticket-gauge__percentage">72%</span>
                <span className="ticket-gauge__label">Closed Ticket</span>
              </div>
            </div>
          </div>

          <div className="ticket-gauge__summary">
            <div>
              <h4>67%</h4>
              <p>New Ticket</p>
            </div>
            <div>
              <h4>33%</h4>
              <p>Repeat Ticket</p>
            </div>
            <div>
              <h4>1 Day</h4>
              <p>Duration</p>
            </div>
          </div>
        </section>

        {/* Panel C: Multi-layered Stacked Bar Chart Card */}
        <section className="dashboard-panel panel-ticket-resolved">
          <div className="dashboard-panel__header">
            <h3 className="dashboard-panel__title">Ticket Resolved</h3>
            <span className="dashboard-panel__view-all">View All</span>
          </div>

          <div className="resolved-chart">
            <div className="resolved-chart__axis-y">
              <span>120</span><span>100</span><span>80</span><span>60</span><span>40</span><span>20</span><span>0</span>
            </div>
            <div className="resolved-chart__bars-wrapper">
              {/* Mon */}
              <div className="resolved-chart__col">
                <div className="resolved-chart__stacked-bar">
                  <div className="segment segment--grey" style={{height: '15%'}}></div>
                  <div className="segment segment--yellow" style={{height: '10%'}}></div>
                  <div className="segment segment--purple" style={{height: '15%'}}></div>
                  <div className="segment segment--pink" style={{height: '40%'}}></div>
                </div>
                <span className="resolved-chart__day">Mon</span>
              </div>
              {/* Tue */}
              <div className="resolved-chart__col">
                <div className="resolved-chart__stacked-bar">
                  <div className="segment segment--grey" style={{height: '5%'}}></div>
                  <div className="segment segment--yellow" style={{height: '20%'}}></div>
                  <div className="segment segment--purple" style={{height: '22%'}}></div>
                  <div className="segment segment--pink" style={{height: '53%'}}></div>
                </div>
                <span className="resolved-chart__day">Tue</span>
              </div>
              {/* Wed */}
              <div className="resolved-chart__col">
                <div className="resolved-chart__stacked-bar">
                  <div className="segment segment--grey" style={{height: '25%'}}></div>
                  <div className="segment segment--yellow" style={{height: '15%'}}></div>
                  <div className="segment segment--purple" style={{height: '20%'}}></div>
                  <div className="segment segment--pink" style={{height: '40%'}}></div>
                </div>
                <span className="resolved-chart__day">Wed</span>
              </div>
              {/* Thu */}
              <div className="resolved-chart__col">
                <div className="resolved-chart__stacked-bar">
                  <div className="segment segment--grey" style={{height: '5%'}}></div>
                  <div className="segment segment--yellow" style={{height: '20%'}}></div>
                  <div className="segment segment--purple" style={{height: '10%'}}></div>
                  <div className="segment segment--pink" style={{height: '65%'}}></div>
                </div>
                <span className="resolved-chart__day">Thu</span>
              </div>
              {/* Fri */}
              <div className="resolved-chart__col">
                <div className="resolved-chart__stacked-bar">
                  <div className="segment segment--grey" style={{height: '25%'}}></div>
                  <div className="segment segment--yellow" style={{height: '20%'}}></div>
                  <div className="segment segment--purple" style={{height: '15%'}}></div>
                  <div className="segment segment--pink" style={{height: '20%'}}></div>
                </div>
                <span className="resolved-chart__day">Fri</span>
              </div>
              {/* Sat */}
              <div className="resolved-chart__col">
                <div className="resolved-chart__stacked-bar">
                  <div className="segment segment--grey" style={{height: '10%'}}></div>
                  <div className="segment segment--yellow" style={{height: '15%'}}></div>
                  <div className="segment segment--purple" style={{height: '25%'}}></div>
                  <div className="segment segment--pink" style={{height: '42%'}}></div>
                </div>
                <span className="resolved-chart__day">Sat</span>
              </div>
            </div>
          </div>

          <div className="resolved-chart__footer">
            <div className="footer-metric">
              <h3>30%</h3>
              <p>Last week</p>
            </div>
            <div className="footer-metric">
              <h3>70%</h3>
              <p>Last month</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Second;