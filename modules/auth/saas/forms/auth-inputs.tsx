import { FieldErrors, UseFormRegister } from "react-hook-form";
import { InputField } from "../../../../resources/inputs/input-field";
type AuthFormData =
  | {
      email: string;
      password: string;
      confirm_password: string;
    }
  | {
      email: string;
      password: string;
      confirm_password: never;
    }
  | {
      email: string;
      password: never;
      confirm_password: never;
    };

interface AuthInputProps {
  register: UseFormRegister<AuthFormData>;
  errors: FieldErrors;
  action: "register" | "login" | "confirm-reset-password" | "reset-password";
}

const inputConfig = {
  email: {
    type: "email",
    placeholder: "Email",
    validation: { required: "Email is required" },
  },
  password: {
    type: "password",
    placeholder: "Password",
    validation: { required: "Password is required" },
  },
  confirm_password: {
    type: "password",
    placeholder: "Confirm Password",
    validation: { required: "Confirm Password is required" },
  },
} as const;

type InputConfigKey = keyof typeof inputConfig;

const AuthInputs: React.FC<AuthInputProps> = ({ register, errors, action }) => {
  const fieldsToShow = {
    email: ["register", "login", "reset-password"].includes(action),
    password: ["register", "login", "confirm-reset-password"].includes(action),
    confirm_password: ["register", "confirm-reset-password"].includes(action),
  };

  return (
    <>
      {(
        Object.entries(inputConfig) as [
          InputConfigKey,
          (typeof inputConfig)[InputConfigKey]
        ][]
      ).map(
        ([name, config]) =>
          fieldsToShow[name] && (
            <InputField<AuthFormData>
              key={name}
              register={register}
              errors={errors}
              name={name}
              {...config}
            />
          )
      )}
    </>
  );
};

export default AuthInputs;
