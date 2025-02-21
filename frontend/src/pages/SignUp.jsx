const SignUp = () => {
  return (
    <section className="flex w-96 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-black p-8">
      <h1>Welcome to DarkDrive</h1>
      <p className="text-center">
        Login and upload your files, safe and secure, completely free!
      </p>
      <hr />
      <span className="flex w-full flex-col gap-2">
        <label>Email</label>
        <input placeholder="example@email.com" type="email" />
      </span>
      <span className="flex w-full flex-col gap-2">
        <label>Password</label>
        <input
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
          type="password"
        />
      </span>
      <span className="flex w-full flex-col gap-2">
        <label>Confirm Password</label>
        <input
          placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
          type="password"
        />
      </span>
    </section>
  );
};

export default SignUp;
