import React, { useRef } from "react";

function TicketForm(props) {
  const {
    isDragging,
    avatarPreview,
    fullName,
    email,
    github,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSubmit,
    handleRemoveImage,
    handleFileChange,
    handleChange,
    errors,
  } = props;

  const fileInputRef = useRef(null);

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      encType="multipart/form-data"
      noValidate
      className="form"
    >
      <div>
        <label className="avatar-title">Upload Avatar</label>

        <div
          className={`avatar-drop ${isDragging ? "dragging" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={
            !avatarPreview ? () => fileInputRef.current.click() : undefined
          }
        >
          {avatarPreview ? (
            <div className="avatar-preview-area">
              <div className="preview">
                <img src={avatarPreview} alt="avatar preview" />

                <div className="avatar-actions">
                  <button type="button" onClick={handleRemoveImage}>
                    Remove Image
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="prompt-area">
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
            ref={fileInputRef}
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        {errors?.avatar && <div className="error">{errors.avatar}</div>}

        <div className="small">
          <img src="/ticket_items/images/icon-info.svg" alt="Info icon" />
          Upload your photo (JPG or PNG, max size: 2MB)
        </div>
      </div>

      <div className="fullName">
        <label htmlFor="fullName">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={fullName}
          onChange={handleChange}
          className={errors?.fullName ? "input-error" : ""}
          id="fullName"
        />
        {errors?.fullName && (
          <div className="error">
            <svg
              className="info-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"
              />
              <path
                fill="currentColor"
                d="M8.004 10.462V7.596ZM8 5.57v-.042Z"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.004 10.462V7.596M8 5.569v-.042"
              />
            </svg>

            {errors.fullName}
          </div>
        )}
      </div>

      <div className="email">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          name="email"
          value={email}
          placeholder="example@email.com"
          onChange={handleChange}
          className={errors?.email ? "input-error" : ""}
          id="email"
        />
        {errors?.email && (
          <div className="error">
            <svg
              className="info-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"
              />
              <path
                fill="currentColor"
                d="M8.004 10.462V7.596ZM8 5.57v-.042Z"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.004 10.462V7.596M8 5.569v-.042"
              />
            </svg>
            {errors.email}
          </div>
        )}
      </div>

      <div className="github">
        <label htmlFor="github">Github username</label>
        <input
          type="text"
          name="github"
          value={github}
          placeholder="@yourusername"
          onChange={handleChange}
          className={errors?.github ? "input-error" : ""}
          id="github"
        />
        {errors?.github && (
          <div className="error">
            <svg
              className="info-icon"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2 8a6 6 0 1 0 12 0A6 6 0 0 0 2 8Z"
              />
              <path
                fill="currentColor"
                d="M8.004 10.462V7.596ZM8 5.57v-.042Z"
              />
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.004 10.462V7.596M8 5.569v-.042"
              />
            </svg>
            {errors.github}
          </div>
        )}
      </div>

      <div>
        <button type="submit" className="submit-btn">
          Generate My Ticket
        </button>
      </div>
    </form>
  );
}

export default TicketForm;
