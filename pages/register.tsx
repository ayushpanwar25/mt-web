/* eslint-disable react-hooks/rules-of-hooks */
import * as React from "react";
import { useRouter } from "next/router";
import { Formik, Field, Form, FormikHelpers, ErrorMessage } from "formik";
import MTHeader from "../components/MTHeader";
import * as Yup from "yup";
import { gql, useMutation } from "@apollo/client";
import Layout from "../components/Layout";

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Min. 4 characters")
    .max(30, "Max. 30 characters")
    .required("Username is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Min. 8 characters")
    .max(30, "Max. 30 characters")
    .required("Password is required"),
});

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

const REGISTER_USER = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
  ) {
    register(
      data: { username: $username, email: $email, password: $password }
    ) {
      errors {
        key
        message
      }
      user {
        username
        email
      }
    }
  }
`;

const Register = () => {
  const router = useRouter();
  const [registerUser, { data, loading, error }] =
    useMutation(REGISTER_USER); /* , {
    update(cache, { data: { register } }) {
      cache.writeQuery({
        query: gql`
          query GetCurrentUser {
            me {
              id
              username
            }
          }
        `,
        data: {
          getCurrentUser: register.user,
        },
      });
    },
  }); */

  return (
    <div className="card form-control h-fit w-96 text-black bg-slate-100 shadow-xl">
      <div className="card-body">
        {error && <p className="text-red-500">{error.message}</p>}
        {loading && <p className="text-green-500">Loading...</p>}
        <div className="font-bold text-3xl">Sign Up</div>
        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (
            values: RegisterInput,
            { setErrors }: FormikHelpers<RegisterInput>
          ) => {
            const res = await registerUser({
              variables: {
                username: values.username,
                email: values.email,
                password: values.password,
              },
            });
            const errors: { [key: string]: string } = {};
            if (res.data.register.errors) {
              res.data.register.errors.forEach(
                (error: { key: string; message: string }) => {
                  errors[error.key] = error.message;
                }
              );
              setErrors(errors);
            } else {
              router.push("/");
            }
          }}
        >
          {() => (
            <Form>
              <div className="grid grid-rows-[3_1fr]">
                <div>
                  <label htmlFor="username" className="label ">
                    <span className="label-text text-black font-bold">
                      Username
                    </span>
                  </label>
                  <Field
                    id="username"
                    name="username"
                    autoComplete="off"
                    type="text"
                    className="input w-full max-w-md shadow-sm focus:outline-0 focus:shadow-md"
                  />
                  <label className="label">
                    <ErrorMessage name="username" />
                  </label>
                </div>

                <div>
                  <label htmlFor="email" className="label ">
                    <span className="label-text text-black font-bold">
                      Email
                    </span>
                  </label>
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="off"
                    className="input w-full max-w-md shadow-sm focus:outline-0 focus:shadow-md"
                  />
                  <label className="label">
                    <ErrorMessage name="email" />
                  </label>
                </div>

                <div>
                  <label htmlFor="password" className="label ">
                    <span className="label-text text-black font-bold">
                      Password
                    </span>
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="off"
                    className="input w-full max-w-md shadow-sm focus:outline-0 focus:shadow-md"
                  />
                  <label className="label">
                    <ErrorMessage className="" name="password" />
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-success w-fit">
                Sign Up
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

Register.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Register;
