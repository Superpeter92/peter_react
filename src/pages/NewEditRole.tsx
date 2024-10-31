import { useNavigate, useParams } from "react-router-dom";
import {
  createRole,
  getFeatureOptions,
  getRoleById,
  updateRole,
} from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Input from "../components/UI/Input";
import { useState } from "react";
import Card from "../components/UI/Card";
import AnimatedButton from "../components/UI/AnimatedButton";
import { IconUserEdit, IconUserPlus } from "@tabler/icons-react";
import { toast } from "react-toastify";
import SpinnerButton from "../components/UI/SpinnerButton";
import { MultiSelect } from "../components/UI/MultiSelect";

type FormField = {
  value: string;
  error: boolean;
};

type FormState = {
  nome: FormField;
  feature: { id: number | string; name: string; permissionId: number }[] | [];
};

const NewEditRole: React.FC = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: role } = useQuery(
    ["roles", id],
    async () => await getRoleById(id!),
    {
      enabled: !!id,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );
  console.log(role, "role");
  const { data: feature } = useQuery(
    ["getFeatureOptions"],
    async () => await getFeatureOptions(),
    {
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    },
  );

  console.log(feature);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formState, setFormState] = useState<FormState>({
    nome: { value: id ? role!.nome : "", error: false },
    feature:
      id && role && role.features && role.features.length > 0
        ? role.features.map((perm) => ({
            id: perm.id, // ID of the feature
            permissionId: perm.permissionId, // ID of the permission (Lettura, Scrittura, Lettura e Scrittura)
            name: `${perm.name} (${perm.permissionId === 1 ? "Lettura" : "Scrittura"})`, // Name of the feature with permission type
          }))
        : [],
  });

  const { mutate: mutateCreate } = useMutation(createRole);
  const { mutate: mutateUpdate } = useMutation(updateRole);
  const isFormValid = () => {
    return formState.nome.value.trim() !== "";
  };
  // Aggiungi questa funzione nel tuo componente
  const mappedFeatures = feature?.map((o) => ({
    id: o.id,
    name: `${o.name} (${o.permissionId === 1 ? "Lettura" : "Scrittura"})`,
    permissionId: o.permissionId,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    if (!isFormValid()) {
      toast.error("Compila il form correttamente", {
        position: "bottom-center",
      });
      return;
    }
    const removeSuffix = (input: string) => {
      const lastDashIndex = input.lastIndexOf("-");
      return lastDashIndex !== -1 ? input.substring(0, lastDashIndex) : input;
    };
    const roleData = {
      id: Number(id) || undefined,
      nome: formState.nome.value,
      feature:
        formState.feature.length > 0
          ? formState.feature.map((f) => ({
              id: removeSuffix(f.id as string),
              permissionId: f.permissionId,
              name: f.name,
            }))
          : [],
    };
    if (id) {
      mutateUpdate(roleData, {
        onSuccess: (data) => {
          toast.success(data.message, { position: "bottom-center" });
          queryClient.invalidateQueries(["roles"]);
          navigate(-1);
        },
      });
    } else {
      mutateCreate(roleData, {
        onSuccess: (data) => {
          toast.success(data.message, { position: "bottom-center" });
          queryClient.invalidateQueries(["roles"]);
          navigate(-1);
        },
      });
    }
  };

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
            {id ? "Modifica Ruolo" : "Nuovo Ruolo"}
          </div>
        </div>
        <form className="grid grid-cols-1">
          <Input
            name="nome"
            label="Nome"
            type="text"
            value={formState.nome.value}
            placeholder="Inserisci il nome del ruolo"
            required={true}
            onChange={(value, error) =>
              setFormState((prev) => ({
                ...prev,
                nome: { value, error },
              }))
            }
            submitted={submitted}
          />
          {/* Aggiungi qui un componente Select per i permessi delle feature */}
          {/* Esempio di Select per i permessi */}
          <MultiSelect
            label="Permessi"
            name="permessi"
            value={formState.feature}
            onChange={(value) =>
              setFormState((prev) => ({
                ...prev,
                feature: value,
              }))
            }
            required
            submitted={submitted}
            options={mappedFeatures!}
          />
        </form>
        <div className={`col-span-1 mt-10 grid gap-4`}>
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

export default NewEditRole;
