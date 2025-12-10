import React from "react";
import Heading from "./components/header";
import Intro from "./components/introduction";
import BottomLine from "./components/squigglyLineBottom";
import TicketForm from "./components/Form";
import ShowTicket from "./components/Ticket";
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
      userLocation: "Fetching Location...",
      locationAsked: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });

    if (!this.state.locationAsked) {
      this.setState({ locationAsked: true });
      this.getUserLocation().then((loc) => {
        this.setState({ userLocation: loc });
      });
    }
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

  async componentDidMount() {
    const location = await this.getUserLocation();
    this.setState({ userLocation: location });
  }

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

    const location = this.state.userLocation;

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
        <BottomLine />
        {!ticketVisible ? (
          <>
            <Intro />
            <TicketForm
              avatarPreview={avatarPreview}
              fullName={fullName}
              email={email}
              github={github}
              errors={errors}
              handleSubmit={this.handleSubmit}
              handleChange={this.handleChange}
              handleFileChange={this.handleFileChange}
              handleRemoveImage={this.handleRemoveImage}
              handleDragOver={this.handleDragOver}
              handleDragLeave={this.handleDragLeave}
              handleDrop={this.handleDrop}
            />
          </>
        ) : (
          <ShowTicket
            avatarPreview={avatarPreview}
            fullName={fullName}
            email={email}
            github={github}
            ticketData={ticketData}
          />
        )}
      </div>
    );
  }
}

export default App;
