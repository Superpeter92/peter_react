import React, { useState, useRef, useEffect } from "react";
import { useSpring, animated, to } from "@react-spring/web";
import Input from "../components/UI/Input";
import Logo from "../assets/logo.png";
import { useGesture } from "@use-gesture/react";
import { useAuth } from "../utils/store/useAuth";
import SpinnerButton from "../components/UI/SpinnerButton";
import { useNavigate } from "react-router-dom";

type FormField = {
  value: string;
  error: boolean;
};

type FormState = {
  email: FormField;
  password: FormField;
};

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login, setUser } = useAuth((state) => state);
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>({
    email: { value: "", error: true },
    password: { value: "", error: true },
  });
  const [submitted, setSubmitted] = useState(false);

  const domTarget = useRef(null);
  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: { mass: 5, tension: 350, friction: 40 },
    }),
  );

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener("gesturestart", preventDefault);
    document.addEventListener("gesturechange", preventDefault);
    return () => {
      document.removeEventListener("gesturestart", preventDefault);
      document.removeEventListener("gesturechange", preventDefault);
    };
  }, []);

  useGesture(
    {
      onDrag: ({ active, offset: [x, y] }) =>
        api({ x, y, rotateX: 0, rotateY: 0, scale: active ? 1 : 1.1 }),
      onPinch: ({ offset: [d, a] }) => api({ zoom: d / 200, rotateZ: a }),
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging &&
        api({
          rotateX: calcX(py, y.get()),
          rotateY: calcY(px, x.get()),
          scale: 1.1,
        }),
      onHover: ({ hovering }) =>
        !hovering && api({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { target: domTarget, eventOptions: { passive: false } },
  );

  const handleChange = (
    field: keyof FormState,
    value: string,
    error: boolean,
  ) => {
    setFormState((prevState) => ({
      ...prevState,
      [field]: { value, error: error },
    }));
  };

  const isFormValid = () => {
    const hasErrors = Object.values(formState).some((field) => field.error);
    const allFieldsFilled = Object.values(formState).every(
      (field) => field.value.trim() !== "",
    );
    return !hasErrors && allFieldsFilled;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid()) {
      console.log("Form is invalid");
      return;
    }

    console.log(formState);
    setLoading(true);

    try {
      const res = await login(formState.email.value, formState.password.value);

      if (!res) {
        // Puoi aggiungere una gestione dell'errore qui, ad esempio:
        console.log("Login failed, no response");
        return;
      }

      setUser(res);
      navigate('/profile');
    } catch (error) {
      console.error("Login error:", error);
      // Puoi aggiungere una gestione dell'errore qui, ad esempio:
      // setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[url('assets/piramide.jfif')] bg-cover bg-center bg-no-repeat">
      <animated.div
        ref={domTarget}
        style={{
          transform: "perspective(600px)",
          x,
          y,
          scale: to([scale, zoom], (s, z) => s + z),
          rotateX,
          rotateY,
          rotateZ,
        }}
        className="w-2/3 rounded-md bg-white bg-opacity-50 p-10 px-10 shadow-xl drop-shadow-lg backdrop-blur-md sm:w-1/3 lg:w-1/5"
      >
        <figure className="mb-6 flex items-center justify-center">
          <img src={Logo} width="160" alt="gat" />
        </figure>
        <form onSubmit={handleSubmit}>
          <Input
            login
            name="email"
            label="Email"
            type="email"
            placeholder="Inserisci la tua Email"
            required={true}
            onChange={(value: string, error: boolean) =>
              handleChange("email", value, error)
            }
            submitted={submitted}
          />
          <Input
            login
            name="password"
            label="Password"
            type="password"
            placeholder="Inserisci la tua Password"
            required={true}
            onChange={(value: string, error: boolean) =>
              handleChange("password", value, error)
            }
            submitted={submitted}
          />
          <SpinnerButton onClick={handleSubmit} className="mt-4 w-full">
            Login
          </SpinnerButton>
        </form>
      </animated.div>
    </div>
  );
};

const calcX = (y: number, ly: number) =>
  -(y - ly - window.innerHeight / 2) / 20;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20;

export default Login;
