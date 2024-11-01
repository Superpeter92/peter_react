import { useNavigate, useParams } from "react-router-dom";
import { getRoles, getUserById, registerUser, updateUser } from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Input from "../components/UI/Input";
import { useEffect, useState } from "react";
import { Option, Select } from "../components/UI/Select";
import { useAuth } from "../utils/store/useAuth";
import Card from "../components/UI/Card";
import AnimatedButton from "../components/UI/AnimatedButton";
import { IconUserEdit, IconUserPlus } from "@tabler/icons-react";
import { toast } from "react-toastify";
import { Utente } from "../model/user";
import SpinnerButton from "../components/UI/SpinnerButton";
import { FeaturesCode } from "../model/enum/featuresCode";
type FormField = {
  value: string;
  error: boolean;
};

type FormState = {
  email: FormField;
  cognome: FormField;
  nome: FormField;
  password?: FormField;
  passwordConfirm?: FormField;
  ruolo?: { value: Option | null; error: boolean };
};
const NewEditUser: React.FC = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const isCurrentUserAdmin = currentUser?.ruolo.features?.some(
    (feature) =>
      feature.code === FeaturesCode.GESTIONE_UTENTI && feature.permissionId === 3,
  );
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);
  const { data: user } = useQuery(
    ["getUser", id],
    async () => await getUserById(id!),
    {
      enabled: !!id,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );
  const { mutate: mutateRegister } = useMutation(registerUser);
  const { mutate: mutateUpdate } = useMutation(updateUser);
  console.log(currentUser, 'currentUser')
  const { data: roles } = useQuery(["getRoles"], async () => await getRoles());
  const [formState, setFormState] = useState<FormState>(() => {
    const baseState = {
      email: { value: id ? user!.email! : "", error: false },
      cognome: { value: id ? user!.cognome! : "", error: false },
      nome: { value: id ? user!.nome! : "", error: false },
      ruolo: { value: null, error: false },
    };

    // Aggiungi campi password solo se l'utente corrente è admin
    const passwordFields = isCurrentUserAdmin
      ? {
          password: { value: "", error: false },
          passwordConfirm: { value: "", error: false },
        }
      : {};

    // Se l'utente è admin e sta modificando se stesso, non includere il ruolo nello state
    if (id && isCurrentUserAdmin && id === String(currentUser!.id)) {
      return { ...baseState, ...passwordFields };
    }

    // Altrimenti, includi il ruolo nello state
    return {
      ...baseState,
      ...passwordFields,
      ruolo: {
        value: id
          ? { id: String(user?.ruolo.id), nome: user!.ruolo!.nome! }
          : null,
        error: false,
      },
    };
  });

  const isFormValid = () => {
    let hasErrors = false;

    // Controlla gli errori generali del form
    Object.entries(formState).forEach(([key, field]) => {
      console.log(key, field);
      if (field.error) {
        hasErrors = true;
      }
    });

    // Verifica le password
    if (!id) {
      // Per nuovi utenti, entrambe le password sono obbligatorie
      if (!formState.password?.value || !formState.passwordConfirm?.value) {
        hasErrors = true;
      }
    }

    // Se le password sono state inserite, devono corrispondere
    if (formState.password?.value || formState.passwordConfirm?.value) {
      if (formState.password?.value !== formState.passwordConfirm?.value) {
        hasErrors = true;
      }
    }

    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid()) {
      toast.error("Compila il form correttamente", {
        position: "bottom-center",
      });
      return;
    }

    const userData: Partial<Utente> = {
      id: Number(id) ?? undefined,
      email: formState.email.value ?? undefined,
      cognome: formState.cognome.value ?? undefined,
      nome: formState.nome.value ?? undefined,
      ruolo: formState.ruolo?.value
        ? {
            id: Number(formState.ruolo?.value?.id),
            nome: formState.ruolo.value.nome,
          }
        : user?.ruolo,
    };

    // Aggiungi la password solo se stiamo creando un nuovo utente o se è stata inserita
    if (!id || formState.password?.value) {
      userData.password = formState.password?.value;
    }
    if (id) {
      mutateUpdate(userData, {
        onSuccess: (data) => {
          toast.success(data.message, { position: "bottom-center" });
          queryClient.invalidateQueries(["users"]);
          queryClient.invalidateQueries(["getUser", id]);

          navigate(-1);
        },
      });
    } else {
      mutateRegister(userData, {
        onSuccess: (data) => {
          toast.success(data.message, { position: "bottom-center" });
          queryClient.invalidateQueries(["users"]);
          queryClient.invalidateQueries(["getUser", id]);

          navigate(-1);
        },
      });
    }
  };

  useEffect(() => {
    if (formState.password && formState.passwordConfirm) {
      if (
        formState.password.value !== formState.passwordConfirm.value &&
        submitted
      ) {
        setPasswordError("Le password non corrispondono");
      } else {
        setPasswordError(null);
      }
    }
  }, [formState.password, formState.passwordConfirm, submitted]);
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start bg-[url('assets/piramide.jfif')] bg-cover bg-center bg-no-repeat">
      <Card className="my-10 w-[90%] sm:w-[35%]">
        <div className="mb-5 flex items-center justify-center">
          {id ? (
            <IconUserEdit className="text-purplue" />
          ) : (
            <IconUserPlus className="text-purplue" />
          )}
          <div className="ml-2 font-montserrat text-2xl font-medium capitalize text-purplue">
            {id ? "Modifica Utente" : "Nuovo Utente"}
          </div>
        </div>
        <form className="grid grid-cols-1 sm:grid-cols-2 sm:gap-6">
          <Input
            name="nome"
            label="Nome"
            type="text"
            value={formState.nome.value}
            placeholder="Inserici il nome"
            required={true}
            onChange={(value, error) =>
              setFormState((prev) => ({
                ...prev,
                nome: { value, error },
              }))
            }
            submitted={submitted}
          />
          <Input
            name="cognome"
            label="Cognome"
            type="text"
            value={formState.cognome.value}
            placeholder="Inserici il cognome"
            required={true}
            onChange={(value, error) =>
              setFormState((prev) => ({
                ...prev,
                cognome: { value, error },
              }))
            }
            submitted={submitted}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            value={formState.email.value}
            placeholder="Inserisci l'Email"
            required={true}
            onChange={(value, error) =>
              setFormState((prev) => ({
                ...prev,
                email: { value, error },
              }))
            }
            submitted={submitted}
          />
          {formState.password && (
            <Input
              name="password"
              label="Password"
              type="password"
              value={formState.password.value}
              placeholder="Password"
              required={!id}
              onChange={(value, error) =>
                setFormState((prev) => ({
                  ...prev,
                  password: { value, error },
                }))
              }
              submitted={submitted}
            />
          )}
          {formState.passwordConfirm && (
            <Input
              name="passwordConfirm"
              label="Conferma Password"
              type="password"
              value={formState.passwordConfirm.value}
              placeholder="Conferma Password"
              required={!!formState.password?.value}
              login
              onChange={(value, error) =>
                setFormState((prev) => ({
                  ...prev,
                  passwordConfirm: { value, error },
                }))
              }
              submitted={submitted}
            />
          )}
          {roles &&
            roles?.length > 0 &&
            formState.ruolo &&
            isCurrentUserAdmin &&
            id !== String(currentUser!.id) && (
              <Select
                label="Ruolo"
                name="ruolo"
                value={formState.ruolo.value}
                onChange={(value, error) =>
                  setFormState((prev) => ({
                    ...prev,
                    ruolo: { value, error },
                  }))
                }
                required
                submitted={submitted}
                option={roles.map((x) => ({ id: String(x.id), nome: x.nome }))}
              />
            )}
          {passwordError && (
            <div className="col-span-1 mt-2 font-montserrat text-sm text-red-700 sm:col-span-2">
              {passwordError}
            </div>
          )}
        </form>
        <div className={`col-span-1 mt-10 grid gap-4 sm:grid-cols-2`}>
          <SpinnerButton onClick={handleSubmit}>Salva</SpinnerButton>
          <AnimatedButton
            className="hover:bg-whitr bg-red-500 text-white hover:bg-white hover:text-red-500"
            onClick={() => navigate(-1)}
          >
            Annulla
          </AnimatedButton>
        </div>
      </Card>
    </div>
  );
};

export default NewEditUser;
