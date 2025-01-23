import React from "react";

function WelcomePage({ onLogin, onSignup, onGuest }) {
  return (
    <>
      {/* Main Container */}
      <div className="max-w-md md:max-w-2xl mx-auto mt-8 p-3 bg-white shadow-lg rounded text-center">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-[#2d3748] mb-3">
          Welcome to Dev Collab Net!
        </h1>
        <p className="text-base md:text-lg text-gray-600 mb-4">
          A platform to ask questions, get answers, and share your knowledge
          with the programming world. Join thousands of developers in creating
          a stronger, smarter coding community!
        </p>

        {/* Features Section */}
        <div className="flex flex-row justify-center items-center space-x-8 mt-4 mb-6">
          <div className="text-center">
            {/* QuestionAnswerIcon placeholder */}
            <svg
              className="w-12 h-12 mx-auto text-[#6c63ff]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 20.25c4.97 0 9-2.9 9-6.75s-4.03-6.75-9-6.75-9 2.9-9 6.75a6.4 6.4 0 00.72 2.94L3 19.5l3.31-.83A10.3 10.3 0 0012 20.25z"
              />
            </svg>
            <p className="mt-1">Ask and Answer</p>
          </div>

          <div className="text-center">
            {/* PersonAddIcon placeholder */}
            <svg
              className="w-12 h-12 mx-auto text-[#ff6b6b]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 7.5c0 1.24-.5 2.35-1.31 3.16A4.511 4.511 0 0112 12c-1.24 0-2.35-.5-3.16-1.31A4.511 4.511 0 017.5 7.5c0-1.24.5-2.35 1.31-3.16A4.511 4.511 0 0112 3c1.24 0 2.35.5 3.16 1.31.81.82 1.31 1.93 1.31 3.19zm5.25 10.5c0 1-.37 1.97-1.03 2.68-.66.71-1.55 1.07-2.47 1.07h-.02c-1.54 0-3.36-.32-5.06-1.25-1.85-1-3.32-2.46-3.32-4.5 0-.99.38-1.98 1.06-2.69.66-.71 1.56-1.07 2.52-1.07h8.32c.92 0 1.8.36 2.46 1.07.67.7 1.04 1.69 1.04 2.69z"
              />
            </svg>
            <p className="mt-1">Build a Profile</p>
          </div>

          <div className="text-center">
            {/* VisibilityIcon placeholder */}
            <svg
              className="w-12 h-12 mx-auto text-[#00bfa5]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.513 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.055 7-9.542 7s-8.268-2.943-9.542-7z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="mt-1">Explore Insights</p>
          </div>
        </div>

        {/* Call-to-Action Buttons */}
        <div>
          <button
            onClick={onLogin}
            aria-label="Login to your account"
            className="
              bg-blue-600 text-white text-base
              rounded px-4 py-2
              mt-2 mb-2 mx-1
              hover:bg-blue-700
            "
          >
            Login
          </button>
          <button
            onClick={onSignup}
            aria-label="Create a new account"
            className="
              bg-purple-600 text-white text-base
              rounded px-4 py-2
              mt-2 mb-2 mx-1
              hover:bg-purple-700
            "
          >
            Signup
          </button>
          <button
            onClick={onGuest}
            aria-label="Explore as a guest"
            className="
              border border-cyan-500 text-cyan-500
              rounded px-4 py-2
              mt-2 mb-2 mx-1
              hover:bg-cyan-50
            "
          >
            Guest
          </button>
        </div>

        {/* Motivational Quote */}
        <p className="text-sm text-gray-500 italic mt-4">
          "The best way to predict the future is to create it."
        </p>
      </div>

      {/* About Section */}
      <div className="max-w-md md:max-w-2xl mx-auto mt-6 p-3 bg-gray-100 rounded text-center">
        <h2 className="text-xl font-semibold mb-2">About StackOverflow Clone</h2>
        <p className="text-gray-600 mb-2 text-sm md:text-base">
          StackOverflow Clone is a community-driven Q&A platform designed for
          developers, engineers, and tech enthusiasts. Our mission is to create
          an open, collaborative space where users can solve problems, share
          expertise, and grow professionally.
        </p>
        <p className="text-gray-600 text-xs md:text-sm">
          Whether you're a beginner or an expert, our platform empowers you to
          learn, teach, and connect with peers in the global programming
          community.
        </p>
      </div>

      {/* Footer */}
      <div className="mt-[250px] p-2 bg-[#2d3748] text-white text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} StackOverflow Clone. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Created with ❤️ by Developers for Developers.
        </p>
      </div>
    </>
  );
}

export default WelcomePage;