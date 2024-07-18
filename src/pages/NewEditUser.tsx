import { useParams } from "react-router-dom";
import { getRoles, getUserById } from "../utils/http";
import { useQuery } from "react-query";
import Input from "../components/UI/Input";
import { useState } from "react";
import { Option, Select } from "../components/UI/Select";
import { useAuth } from "../utils/store/useAuth";
type FormField = {
  value: string;
  error: boolean;
};

type FormState = {
  email: FormField;
  cognome: FormField;
  nome: FormField;
  ruolo: { value: Option | null; error: boolean };
  //   error: boolean;

  // categoria: {
  //   value: Option | null;
  //   error: boolean;
  // };
};
const NewEditUser: React.FC = () => {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const isCurrentUserAdmin = currentUser?.ruolo?.nome === "admin";
  const [submitted, setSubmitted] = useState(false);
  const { data: user, isLoading: loadingUser } = useQuery(
    ["getUser", id],
    async () => await getUserById(id!),
    { enabled: !!id },
  );

  const { data: roles, isLoading: loadingRoles } = useQuery(
    ["getRoles"],
    async () => await getRoles(),
  );
  const [formState, setFormState] = useState<FormState>(() => {
    const baseState = {
      email: { value: id ? user!.email! : "", error: false },
      cognome: { value: id ? user!.cognome! : "", error: false },
      nome: { value: id ? user!.nome! : "", error: false },
      ruolo: { value: null, error: false },
    };

    // Se l'utente è admin e sta modificando se stesso, non includere il ruolo nello state
    if (id && isCurrentUserAdmin && id === String(currentUser.id)) {
      return baseState;
    }

    // Altrimenti, includi il ruolo nello state
    return {
      ...baseState,
      ruolo: {
        value: id
          ? { id: String(user?.ruolo.id), nome: user!.ruolo!.nome! }
          : null,
        error: false,
      },
    };
  });
  console.log(id);
  return (
    <div>
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
      {isCurrentUserAdmin &&
        id !== String(currentUser!.id) &&
        roles &&
        roles?.length > 0 && (
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
    </div>
  );
};

export default NewEditUser;
