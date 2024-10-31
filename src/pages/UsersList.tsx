import { useState } from "react";
import { PaginatedUsersResponse, UserQueryParams, Utente } from "../model/user";
import { CancelModal } from "../components/CancelModal";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "../components/Tooltip";
import AnimatedButton from "../components/UI/AnimatedButton";
import { deleteUser, getUsers } from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Pagination } from "../components/Pagination";
import { toast } from "react-toastify";
import { useAuth } from "../utils/store/useAuth";
import { IconAdjustments, IconRefresh, IconSearch } from "@tabler/icons-react";
import { Switch } from "@headlessui/react";
import Input from "../components/UI/Input";
import Spinner from "../components/UI/Spinner";
import { animated, useSpring } from "@react-spring/web";
import Card from "../components/UI/Card";

type FormField = {
  value: string;
  error: boolean;
};

type FormState = {
  email: FormField;
  cognome: FormField;
};



const UsersList: React.FC = () => {
  const { user } = useAuth((state) => state);
  const [modalTitle, setModalTitle] = useState("");
  const [formState, setFormState] = useState<FormState>({
    email: { value: "", error: true },
    cognome: { value: "", error: true },
  });
  const [params, setParams] = useState<UserQueryParams>({
    page: 1,
    limit: 10,
    cognome: "",
    email: "",
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: deleteUserMutate } =
    useMutation(deleteUser);

  const [selectedUser, setSelectedUser] = useState<Utente | null>(null);
  const {
    data: usersList,
    isLoading,
    error,
  } = useQuery(["users", params], async () => await getUsers(params), {
    keepPreviousData: true,
    staleTime: 5000, // 5 secondi
  });
  const navigate = useNavigate();

  const cardAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    maxHeight: isOpen ? 1000 : 0,
    transform: isOpen ? "translateY(0%)" : "translateY(-5%)", // Ridotto leggermente per un effetto più sottile
    config: {
      tension: 400,
      friction: 30,
      mass: 1,
      duration: 200, // Durata fissa dell'animazione in millisecondi
    },
    display: isOpen ? "grid" : "none",
  });
  const bottonsAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    maxHeight: isOpen ? 1000 : 0,
    transform: isOpen ? "translateY(0%)" : "translateY(-5%)", // Ridotto leggermente per un effetto più sottile
    config: {
      tension: 400,
      friction: 30,
      mass: 1,
      duration: 200, // Durata fissa dell'animazione in millisecondi
    },
    display: isOpen ? "flex" : "none",
  });

  const handleReset = () => {
    setFormState({
      email: { value: "", error: false },
      cognome: { value: "", error: false },
      // categoria: { value: null, error: false },
    });

    setParams((prevParams) => ({
      ...prevParams,
      email: "",
      cognome: "",
      page: 1,
    }));
  };

  const handleSearch = () => {
    const newParams: UserQueryParams = {
      ...params,
      page: 1, // Resetta la pagina a 1 quando si fa una nuova ricerca
      email: formState.email.value,
      cognome: formState.cognome.value,
    };

    setParams(newParams);

    console.log(formState);
  };
  const handleDeleteUser = (id: number) => {
    deleteUserMutate(id, {
      onSuccess: (data, variables) => {
        toast.success(data.message);
        queryClient.setQueryData<PaginatedUsersResponse>(
          ["users", params],
          (oldData): PaginatedUsersResponse => {
            if (!oldData) {
              // Se non ci sono dati, restituisci una struttura vuota
              return {
                users: [],
                currentPage: 1,
                totalPages: 0,
                totalUsers: 0,
              };
            }
            const updatedUsers = oldData.users.filter(
              (user) => user.id !== variables,
            );
            return {
              ...oldData,
              users: updatedUsers,
              totalUsers: oldData.totalUsers - 1,
              // Potrebbe essere necessario aggiornare anche totalPages qui
              totalPages: Math.ceil((oldData.totalUsers - 1) / params.limit!),
            };
          },
        );
      },
    });
  };
  const openCancelModal = (utente: Utente) => {
    setSelectedUser(utente);
    setIsModalOpen(true);
    setModalTitle(`Elimina utente con email ${utente.email}`);
  };
  const setCurrentPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  if (error) return <div>Si è verificato un errore</div>;

  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-start bg-[url('assets/piramide.jfif')] bg-cover bg-center bg-no-repeat">
      <>
        <CancelModal
          title={modalTitle}
          onDeleteApi={handleDeleteUser}
          isOpen={isModalOpen}
          body="Confermi di voler eliminare l'utente 
        selezionato? Questa azione comporterà la rimozione
        definitiva di tutte le informazioni ad esso associato."
          setIsModalOpen={setIsModalOpen}
          selectedItem={selectedUser}
          setSelectedList={setSelectedUser}
        />
        <div className="w-[80%] px-4 py-10 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-end">
            <div className="sm:flex-auto">
              <h1 className="font-montserrat text-2xl font-semibold leading-6 text-gray-900 sm:text-3xl">
                Lista Utenti
              </h1>
              <p className="mt-2 font-montserrat text-sm text-gray-700 sm:text-base">
                Gestisci gli utenti presenti nell'applicativo
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:mt-0">
              <AnimatedButton
                icon={<PlusIcon className="mr-2 h-6 w-6" />}
                onClick={() => navigate("/user-new")}
                className="bg-purplue text-white hover:bg-darkPurplue"
              >
                Nuovo Utente
              </AnimatedButton>
            </div>
          </div>
          <Card className="mt-4 h-1/2">
            <div className="mb-2 flex flex-col justify-between sm:flex-row">
              <div className="mt-2 flex items-center justify-start">
                <IconAdjustments />
                <span className="font-montserrat text-base font-semibold tracking-[0.2rem] text-black">
                  Filtri
                </span>

                <Switch
                  checked={isOpen}
                  onChange={setIsOpen}
                  className="group relative ml-2 inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-red-500 transition-colors duration-200 ease-in-out focus:outline-none data-[checked]:bg-green-400"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-5"
                  />
                </Switch>
              </div>

              <animated.div
                style={bottonsAnimation}
                className={`my-4 flex flex-col items-center justify-center gap-y-2 sm:flex-row sm:justify-end sm:gap-x-2`}
              >
                <AnimatedButton
                  icon={<IconRefresh />}
                  className="w-full bg-purplue text-white hover:bg-darkPurplue"
                  onClick={handleReset}
                >
                  Reset
                </AnimatedButton>
                <AnimatedButton
                  icon={<IconSearch />}
                  className="w-full bg-green-400 text-white hover:bg-black"
                  onClick={handleSearch}
                >
                  Cerca
                </AnimatedButton>
              </animated.div>
            </div>
            <animated.div
              style={cardAnimation}
              className={`grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2`}
            >
              {/* <Select
                label="Categoria"
                name="categoria"
                value={formState.categoria.value}
                onChange={(value, error) =>
                  setFormState((prev) => ({
                    ...prev,
                    categoria: { value, error },
                  }))
                }
                required
                submitted={submitted}
                option={categorie}
              /> */}
              <Input
                name="email"
                type="email"
                value={formState.email.value}
                placeholder="Cerca per Email"
                onChange={(value, error) =>
                  setFormState((prev) => ({
                    ...prev,
                    email: { value, error },
                  }))
                }
              />
              <Input
                login
                name="cognome"
                type="text"
                placeholder="Cerca per Cognome"
                value={formState.cognome.value}
                onChange={(value, error) =>
                  setFormState((prev) => ({
                    ...prev,
                    cognome: { value, error },
                  }))
                }
              />
            </animated.div>
          </Card>
          {!isLoading && usersList?.users.length === 0 && (
            <div className="mt-10 text-center text-xl font-normal">
              Nessun utente presente
            </div>
          )}
          {isLoading && (
            <div className="flex h-screen items-center justify-center">
              <Spinner
                isLoading={isLoading}
                size={60}
                color="#4F46E5"
                thickness={6}
                minDuration={2000}
              />
            </div>
          )}
          {!isLoading && usersList && usersList?.users.length > 0 && (
            <div className="mt-8 flow-root">
              <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-slate-400 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-white">
                        <tr>
                          <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left font-montserrat text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Nome
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left font-montserrat text-sm font-semibold text-gray-900"
                          >
                            Cognome
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left font-montserrat text-sm font-semibold text-gray-900"
                          >
                            Email
                          </th>
                          <th
                            scope="col"
                            className="px-3 py-3.5 text-left font-montserrat text-sm font-semibold text-gray-900"
                          >
                            Ruolo
                          </th>

                          <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 text-right font-montserrat text-sm sm:pr-6"
                          >
                            Azioni
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white bg-opacity-50 backdrop-blur-md">
                        {usersList.users.map((utente: Utente) => (
                          <tr key={utente.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-left font-montserrat text-sm font-medium text-gray-500 sm:pl-6">
                              {utente.nome}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-left font-montserrat text-sm text-gray-500">
                              {utente.cognome}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-left font-montserrat text-sm text-gray-500">
                              {utente.email}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-left font-montserrat text-sm text-gray-500">
                              {utente.ruolo.nome}
                            </td>

                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                              <Tooltip position="left" tooltip={"Modifica"}>
                                <AnimatedButton
                                  icon={
                                    <PencilSquareIcon
                                      className="h-5 w-5 shrink-0 text-gray-500"
                                      aria-hidden="true"
                                    />
                                  }
                                  iconOnly
                                  onClick={() => {
                                    navigate(`/user-edit/${utente.id}`);
                                  }}
                                  className="hover:bg-purplue"
                                ></AnimatedButton>
                              </Tooltip>

                              {user?.id !== utente.id && (
                                <Tooltip position="right" tooltip={"Elimina"}>
                                  <AnimatedButton
                                    iconOnly
                                    icon={
                                      <TrashIcon
                                        className="h-5 w-5 shrink-0 text-gray-500"
                                        aria-hidden="true"
                                      />
                                    }
                                    className="hover:bg-rose-200"
                                    onClick={() => openCancelModal(utente)}
                                  />
                                </Tooltip>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Pagination
                  totalPages={usersList.totalPages}
                  currentPage={params.page!}
                  setCurrentPage={setCurrentPage}
                />
              </div>
            </div>
          )}
        </div>
      </>
    </div>
  );
};

export default UsersList;
