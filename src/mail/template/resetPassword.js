module.exports = emailCard = (reqURL, username) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email</title>
    <style>
      body {
        background-color: rgb(0, 57, 83);
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, Helvetica, sans-serif;
        color: white;
        height: 600px;
      }
      .email_card {
        width: 60%;
        height: 90%;
        padding: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        backdrop-filter: brightness(0.5);
        border-radius: 10px;
        background-image: url("./img/medical-team.png);
        background-repeat: no-repeat;
        background-position: center;
        background-size: 50%;
      }
      header {
        width: 100%;
      }
      header h2 {
        text-align: center;
      }
      main {
        width: 90%;
        background: rgba(0, 0, 0, 0.379);
        height: 80%;
        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        backdrop-filter: brightness(0.5);
      }
      main .username,
      p {
        text-align: center;
      }
      main a {
        color: white;
        text-decoration: none;
        padding: 10px;
        border: 1px solid;
        border-radius: 10px;
        background-color: #0088c0;
        text-align: center;
      }

      #subject {
        color: red;
        backdrop-filter: brightness(0.9);
        padding: 10px;
      }
       @media (max-width: 720px) {
        .email_card {
          width: 90%;
        }
      }
    </style>
  </head>

  <body>
    <div class="email_card">
      <main>
        <header>
          <h2>Joveth Temple of Health</h2>
          </header>
          <h3 class="username">${username}</h3>
        <p class="message">
         We received a request to reset your password. Click the button below to reset it.
        </p>
        <a
          href="${reqURL}"
          >Reset Password</a
        >
        <p>
          If you didn't request to change your password, you can ignore this
          email.
        </p>
       
      </main>
    </div>
  </body>
</html>
`;
};
