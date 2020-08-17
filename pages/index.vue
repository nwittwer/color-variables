<template lang="pug">
  div
    section
      h1.brand Clincase
    section
      h1 Title
      h2 Subtitle
      h3 XXLarge
      h4 XLarge
      h5 XLarge
      h6 Regular Medium
    section
      p Generating random paragraphs can be an excellent way for writers to get their creative flow going at the beginning of the day. The writer has no idea what topic the random paragraph will be about when it appears. This forces the writer to use creativity to complete one of #[a(href="#") three common writing challenges]. The writer can use the paragraph as the first one of a short story and build upon it. A second option is to use the random paragraph somewhere in a short story they create. The third option is to have the random paragraph be the ending paragraph in a short story. No matter which of these challenges is undertaken, the writer is forced to use creativity to incorporate the paragraph into their writing.
      br
      a(href="#") This is a link
    section
      p.success Success!
      br
      p.error This is a warning!
    section
      button.button--primary Button
      button.button--secondary Button
    section
      input(type="text" value="Enter some text...")
      textarea Enter some text...
    section
      .modal
        .modal__inner
          h2 Title
          p This is some text
        .modal__background
    section
      .card
        .card__header
        .card__image
        .card__content
          h3 Clincase ePRO
          p This is some other text content
          a(href="#") Link
        .card__footer
</template>

<script></script>

<style lang="scss">
@use '~/assets/scss/tokens'; // Import tokens & themes

html,
body {
  color: var(--text-high-contrast);
  background-color: var(--bg-color);
  font-family: "Roboto", -apple-system, BlinkMacSystemFont, "Segoe UI", Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-seriff;
  line-height: 1.5;
  transition: background-color 0.3s;
}
</style>

<style lang="scss" scoped>
/////////////////
// Styles for the page
section {
  margin: 8rem auto;
}
/////////////////

// Headers
h1,
h2,
h3,
h4,
h5,
h6 {
  color: var(--text-high-contrast);
  color: var(--text-high-contrast);
}

h1 {
  font-size: 48px;
  line-height: 60px;

  &.brand {
    color: var(--brand-primary-color);
  }
}
h2 {
  font-size: 32px;
  line-height: 40px;
}
h3 {
  font-size: 28px;
  line-height: 36px;
}
h4 {
  font-size: 24px;
  line-height: 28px;
}
h5 {
  font-size: 20px;
  line-height: 24px;
}

// Regular Medium
h6 {
  font-size: 1rem;
  line-height: 20px;
  font-weight: 500;
}

.text--small {
  font-size: 14px;
  line-height: 16px;
}

.text--xsmall {
  font-size: 12px;
  line-height: 16px;
}

.text--xxsmall {
  font-size: 10px;
  line-height: 10px;
}

///////////////////////////////////
// Content text

p {
  font-size: 1rem;
  line-height: 1.4;
  color: var(--text-high-contrast);
}

a {
  color: var(--brand-primary-color);
  text-decoration: underline;
}

///////////////////////////////////
// Utilities

.success {
  color: var(--utility-success);
  border: 1px solid var(--utility-success);
  display: block;
  padding: 1rem;
}

.error {
  color: var(--utility-error);
  border: 1px solid var(--utility-error);
  display: block;
  padding: 1rem;
}

///////////////////////////////////
// Buttons
button {
  box-shadow: none;
  border-radius: 0.25em;
  font-size: 1rem;
  font-family: "Open Sans", sans-serif;
  color: #ffffff;
  padding: 0.6em 2.2em;
  cursor: pointer;
  background: #5f8ee4;

  &.button--primary {
    color: var(--text-high-contrast-inverted);
    background: var(--brand-primary-color);

    &:hover {
      background: var(--brand-primary-color-dark);
    }
  }

  &.button--secondary {
    color: var(--text-high-contrast-inverted);
    background: var(--brand-secondary-color);

    &:hover {
      background: var(--brand-secondary-color-dark);
    }
  }
}

///////////////////////////////////
// Modals
.modal {
  position: relative;
  height: 500px;
  width: 100%;
  display: block;

  .modal__inner {
    background: var(--fg-color);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: 80%;
    width: 50%;
    display: flex;
    flex-direction: column;
  }

  .modal__background {
    background: var(--bg-high-contrast);
    height: 100%;
    width: 100%;
  }
}

///////////////////////////////////
// Cards
.card {
  position: relative;
  width: 400px;
  max-width: 100%;
  background-color: var(--fg-color);

  .card__header {
  }

  .card__image {
    height: 300px;
    width: 100%;
    background-image: url(https://clincase.com/wp-content/uploads/2015/04/clincase-clinical-trials-software-60.jpg);
    background-size: cover;
  }

  .card__content {
    padding: 1rem;
  }

  .card__footer {
    padding: 1rem;
  }
}

///////////////////////////////////
// Inputs

input[type="text"],
input[type="search"],
textarea {
  color: var(--text-high-contrast);
  background: var(--fg-color);
}
</style>
