import React from "react";
import Heading from "./components/header";
import Intro from "./components/introduction";
import "./App.css";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      avatarFile: null,
      avatarPreview: null,
      fullName: "",
      email: "",
      github: "",
      errors: {},
      ticketData: null,
      isDragging: false,
      ticketVisible: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (!file.type.startsWith("image/")) {
      this.setState({
        errors: {
          ...this.state.errors,
          avatar: "Please select an image file.",
        },
      });
    }
    if (file.size > maxSize) {
      this.setState({
        errors: { ...this.state.errors, avatar: "Image must be under 2MB" },
      });
    }

    const preview = URL.createObjectURL(file);
    this.setState({
      avatarFile: file,
      avatarPreview: preview,
      errors: { ...this.state.errors, avatar: null },
    });
  }

  validate = () => {
    const errors = {};
    if (!this.state.fullName.trim()) errors.fullName = "Full name is required.";
    if (!this.state.email.trim()) errors.email = "Email is required.";
    else {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(this.state.email)) errors.email = "Enter a valid email";
    }
    if (!this.state.github.trim())
      errors.github = "GitHub username is required.";

    return errors;
  };

  handleDragOver = (e) => {
    e.preventDefault();
    this.setState({ isDragging: true });
  };

  handleDragLeave = (e) => {
    e.preventDefault();
    this.setState({ isDragging: false });
  };

  handleDrop = (e) => {
    e.preventDefault();
    this.setState({ isDragging: false });

    const file = e.dataTransfer.files[0];
    if (file) this.handleFileChange({ target: { files: [file] } });
  };

  formatTicketDate = () => {
    const date = new Date();
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  getUserLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return resolve("Unknown location");
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
            );
            const data = await response.json();
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "";
            const country = data.address.country || "";
            resolve(`${city}, ${country}`);
          } catch (error) {
            resolve("Unknown location");
          }
        },
        () => resolve("Unknown location")
      );
    });
  };

  triggerFileSelect = () => {
    if (this.fileInput) {
      this.fileInput.click();
    }
  };

  handleRemoveImage = () => {
    if (this.state.avatarPreview) {
      URL.revokeObjectURL(this.state.avatarPreview);
    }

    this.setState({
      avatarPreview: null,
      avatarFile: null,
    });
  };

  async handleSubmit(e) {
    e.preventDefault();
    const errors = this.validate();
    if (Object.keys(errors).length) {
      this.setState({ errors });
      return;
    }

    const ticketId =
      "#" +
      Math.floor(Math.random() * 100000)
        .toString()
        .padStart(5, "0");

    const location = await this.getUserLocation();

    const ticketData = {
      fullName: this.state.fullName,
      email: this.state.email,
      github: this.state.github,
      avatarPreview: this.state.avatarPreview,
      ticketDate: `${this.formatTicketDate()} / ${location}`,
      ticketID: ticketId,
    };

    this.setState({ ticketData });
    this.setState({ ticketVisible: true });
  }

  componentWillUnmount() {
    if (this.state.avatarPreview) URL.revokeObjectURL(this.state.avatarPreview);
  }

  render() {
    const {
      avatarPreview,
      fullName,
      email,
      github,
      errors,
      ticketData,
      ticketVisible,
    } = this.state;

    return (
      <div className="app">
        <Heading />
        <div class="line-bottom">
          <picture>
            <source
              srcset="/ticket_items/images/pattern-squiggly-line-bottom-desktop.svg"
              media="(min-width: 1200px)"
            />
            <img
              src="/ticket_items/images/pattern-squiggly-line-bottom-mobile-tablet.svg"
              alt="squiggly line"
            />
          </picture>
        </div>
        {!ticketVisible ? (
          <>
            <Intro />{" "}
            <form
              onSubmit={this.handleSubmit}
              encType="multipart/form-data"
              noValidate
              className="form"
            >
              <div>
                <label className="avatar-title">Upload Avatar</label>

                <div
                  className={`avatar-drop ${
                    this.state.isDragging ? "dragging" : ""
                  }`}
                  onDragOver={this.handleDragOver}
                  onDragLeave={this.handleDragLeave}
                  onDrop={this.handleDrop}
                  onClick={!avatarPreview ? this.triggerFileSelect : undefined}
                >
                  {avatarPreview ? (
                    <div className="avatar-preview-area">
                      <div style={{ display: "grid", gap: "10px" }}>
                        <img
                          src={avatarPreview}
                          alt="avatar preview"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "10px",
                            alignSelf: "center",
                            justifySelf: "center",
                          }}
                        />

                        <div className="avatar-actions">
                          <button
                            type="button"
                            onClick={this.handleRemoveImage}
                          >
                            Remove Image
                          </button>
                          <button
                            type="button"
                            onClick={this.triggerFileSelect}
                          >
                            Change Image
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "grid", gap: "10px" }}>
                      <div className="upload-icon-bg">
                        <img
                          src="/ticket_items/images/icon-upload.svg"
                          alt="upload icon"
                        />
                      </div>

                      <p>Drag & drop or click to upload</p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={(input) => (this.fileInput = input)}
                    onChange={this.handleFileChange}
                    className="file-input"
                  />
                </div>

                {errors && errors.avatar && (
                  <div className="error">{errors.avatar}</div>
                )}
                <div className="small">
                  Upload your photo (JPG or PNG, max size: 2MB)
                </div>
              </div>

              <div className="fullName">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={fullName}
                  onChange={this.handleChange}
                />
                {errors && errors.fullName && (
                  <div className="error">{errors.fullName}</div>
                )}
              </div>

              <div className="email">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={email}
                  placeholder="example@email.com"
                  onChange={this.handleChange}
                />
                {errors && errors.email && (
                  <div className="error">{errors.email}</div>
                )}
              </div>

              <div className="github">
                <label>Github username</label>
                <input
                  type="text"
                  name="github"
                  value={github}
                  placeholder="@yourusername"
                  onChange={this.handleChange}
                />
                {errors && errors.github && (
                  <div className="error">{errors.github}</div>
                )}
              </div>

              <div>
                <button type="submit" className="submit-btn">
                  Generate My Ticket
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="ticket-alert">
            <div className="alert-text">
              <h1>
                Congrats, <span className="colored-name">{fullName}!</span> Your
                ticket is ready.
              </h1>
              <p
                className="emailed-text"
                style={{ alignSelf: "center", margin: "20px 0 30px 0" }}
              >
                We've emailed your ticket to{" "}
                <span
                  className="colored-email"
                  style={{ color: "hsl(7, 88%, 67%)" }}
                >
                  {email}
                </span>{" "}
                and will send updates in the run up to the event
              </p>
            </div>

            <div className="ticket-preview">
              <div
                className="ticket"
                style={{
                  backgroundImage: `url("/ticket_items/images/pattern-ticket.svg")`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  width: "100%",
                  maxWidth: "400px",
                  aspectRatio: "7 / 3",
                  position: "relative",
                  borderRadius: "10px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "5%",
                    left: "8%",
                    display: "flex",
                    gap: "10px",
                  }}
                  className="logo-ticket"
                >
                  <img
                    src="/ticket_items/images/logo-mark.svg"
                    alt="logo-ticket"
                    style={{ width: "clamp(25px, 3vw, 80px)", height: "auto" }}
                  />
                  <div
                    className="nameanddate"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                      textAlign: "left",
                    }}
                  >
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "clamp(1.5rem, 2vw + 1rem, 1.5rem)",
                      }}
                    >
                      Coding Conf
                    </h2>
                    <p
                      className="date"
                      style={{
                        fontSize: "clamp(0.5rem, 2vw , .8rem)",
                        color: "hsl(252, 6%, 83%)",
                      }}
                    >
                      {ticketData.ticketDate}
                    </p>
                  </div>
                </div>

                <div
                  className="avatar-section"
                  style={{ position: "absolute", bottom: "5%", left: "8%" }}
                >
                  <img
                    src={avatarPreview}
                    alt="avatar image"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "10px",
                    }}
                  />
                  <div className="avatar-details">
                    <h3
                      className="name"
                      style={{ fontSize: "clamp(1rem, 2vw + 1rem, 1.5rem)" }}
                    >
                      {fullName}
                    </h3>{" "}
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "clamp(0.5rem, 2vw , .8rem)",
                        color: "hsl(252, 6%, 83%)",
                      }}
                    >
                      <img
                        src="/ticket_items/images/icon-github.svg"
                        alt="github-icon"
                      />
                      {github}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "400",
                    position: "absolute",
                    top: "65%",
                    right: "10%",
                    transform: "rotate(90deg)",
                    transformOrigin: "top right",
                    color: "hsla(0, 0%, 56%, 1.00)",
                    opacity: ".5",
                  }}
                >
                  {ticketData.ticketID}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
