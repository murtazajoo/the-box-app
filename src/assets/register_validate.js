import { createClient } from "@supabase/supabase-js";
const validate = async (values) => {
  const supabase = createClient(
    "https://xmeyiduceoxfvciwoajn.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtZXlpZHVjZW94ZnZjaXdvYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA1MzkzMDcsImV4cCI6MTk5NjExNTMwN30.euNOxeyYsUh6cegLmddHuVjFwU2l28IWZzPzyJ4lTRU"
  );

  const errors = {};
  if (!values.username) {
    errors.username = "Required";
  } else if (values.username.length > 10) {
    errors.username = "Must be 10 characters or less";
  } else if (values.username.length < 5) {
    errors.username = "Must be 5 characters or more";
  } else if (/\s/.test(values.username)) {
    errors.username = "No spaces allowed";
  } else if (/[^a-zA-Z]/.test(values.username)) {
    errors.username = "Only letters allowed";
  } else {
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("username", values.username);
    if (user.length !== 0 && user[0].username === values.username) {
      errors.username = "username not avaiable";
    }

    if (error) {
      console.error(error);
    }
  }
  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length > 10) {
    errors.name = "Must be 10 characters or less";
  } else if (values.name.length < 3) {
    errors.name = "Must be at least 3 character long";
  } else if (/[^a-zA-Z]/.test(values.name)) {
    errors.name = "Only letters allowed";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  } else {
    let { data: user, error } = await supabase
      .from("user")
      .select("*")
      .eq("email", values.email);
    if (user.length !== 0 && user[0].email === values.email) {
      errors.email = "email not avaiable";
    }
    if (error) {
      console.error(error);
    }
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length < 8) {
    errors.password = "Must be at least 8 characters long";
  } else if (!/[!@#$%^&*]/.test(values.password)) {
    errors.password = "Must contain at least one special character (!@#$%^&*)";
  } else if (!/[a-zA-Z0-9]/.test(values.password)) {
    errors.password = "Must contain at least one alphanumeric character";
  }

  if (!values.bio) {
    errors.bio = "Required";
  } else if (values.bio.length > 100) {
    errors.bio = "Must be 100 characters or less";
  } else if (values.bio.length < 20) {
    errors.bio = "Must be at least 20 character long";
  }
  return errors;
};

export default validate;
