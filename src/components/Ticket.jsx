function ShowTicket(props) {
  const { avatarPreview, fullName, email, github, ticketData } = props;

  return (
    <div className="ticket-alert">
      <div className="alert-text">
        <h1>
          Congrats, <span className="colored-name">{fullName}!</span> Your
          ticket is ready.
        </h1>
        <p className="emailed-text">
          We've emailed your ticket to{" "}
          <span className="colored-email">{email}</span> and will send updates
          in the run up to the event
        </p>
      </div>

      <div className="ticket-preview">
        <div className="ticket">
          <div className="logo-ticket">
            <img src="/ticket_items/images/logo-mark.svg" alt="logo-ticket" />
            <div className="nameanddate">
              <h2>Coding Conf</h2>
              <p className="date">{ticketData.ticketDate}</p>
            </div>
          </div>

          <div className="avatar-section">
            <img src={avatarPreview} alt="avatar image" />
            <div className="avatar-details">
              <h3 className="name">{fullName}</h3>{" "}
              <p>
                <img
                  src="/ticket_items/images/icon-github.svg"
                  alt="github-icon"
                />
                {github}
              </p>
            </div>
          </div>

          <div className="ticket-id">{ticketData.ticketID}</div>
        </div>
      </div>
    </div>
  );
}

export default ShowTicket;
