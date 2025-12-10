# Frontend Mentor - Conference ticket generator solution

This is a solution to the [Conference ticket generator challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/conference-ticket-generator-oq5gFIU12w). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [Author](#author)
- [Acknowledgments](#acknowledgments)

## Overview

### The challenge

Users should be able to:

- Complete the form with their details
- Receive form validation messages if:
  - Any field is missed
  - The email address is not formatted correctly
  - The avatar upload is too big or the wrong image format
- Complete the form only using their keyboard
- Have inputs, form field hints, and error messages announced on their screen reader
- See the generated conference ticket when they successfully submit the form
- View the optimal layout for the interface depending on their device's screen size
- See hover and focus states for all interactive elements on the page

### Links

- Solution URL: [Solution URL](https://github.com/WesSno/Conference-Ticket-Generator)
- Live Site URL: [Live Site URL](https://kbk-conference-ticket-generator.netlify.app/)

## My process

### Built with

- Semantic HTML5 markup
- CSS custom properties
- Flexbox
- CSS Grid
- Mobile-first workflow
- [React](https://reactjs.org/) - JS library

### What I learned

I learnt how to handle the upload of an image in a form in React and storing it in state.

```js
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
};
```

I learnt how to handle dragging and droping an image in a form.

```js
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
```

```jsx
<div
  className={`avatar-drop ${isDragging ? "dragging" : ""}`}
  onDragOver={handleDragOver}
  onDragLeave={handleDragLeave}
  onDrop={handleDrop}
  onClick={!avatarPreview ? () => fileInputRef.current.click() : undefined}
>
  {avatarPreview ? (
    <div className="avatar-preview-area">
      <div className="preview">
        <img src={avatarPreview} alt="avatar preview" />

        <div className="avatar-actions">
          <button type="button" onClick={handleRemoveImage}>
            Remove Image
          </button>
          <button type="button" onClick={() => fileInputRef.current.click()}>
            Change Image
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="prompt-area">
      <div className="upload-icon-bg">
        <img src="/ticket_items/images/icon-upload.svg" alt="upload icon" />
      </div>

      <p>Drag & drop or click to upload</p>
    </div>
  )}

  <input
    type="file"
    accept="image/*"
    ref={fileInputRef}
    onChange={handleFileChange}
    className="file-input"
  />
</div>
```

I learnt how to get a user's location.

```js
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
```

I learnt how to override a browser's autofill styling.

```css
.fullName input:-webkit-autofill,
.email input:-webkit-autofill,
.github input:-webkit-autofill {
  box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important;
  -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.1) inset !important;
  -webkit-text-fill-color: var(--neutral-0) !important;
  color: var(--neutral-0) !important;
  backdrop-filter: blur(2px) !important;
  -webkit-backdrop-filter: blur(2px) !important;
  border: 1px solid rgba(255, 255, 255, 0.3) !important;
  transition: background-color 9999s ease-in-out 0s !important;
}

.fullName input:-webkit-autofill:focus,
.email input:-webkit-autofill:focus,
.github input:-webkit-autofill:focus {
  -webkit-text-fill-color: var(--neutral-0) !important;
}
```

## Author

- Website - [Kofi Baafi Kwatia](https://github.com/WesSno)
- Frontend Mentor - [@WesSno](https://www.frontendmentor.io/profile/WesSno)
