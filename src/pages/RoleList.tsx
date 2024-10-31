import { useState } from "react";
import { CancelModal } from "../components/CancelModal";
import { useNavigate } from "react-router-dom";
import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Tooltip } from "../components/Tooltip";
import AnimatedButton from "../components/UI/AnimatedButton";
import { deleteRole, getRoleList } from "../utils/http";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Pagination } from "../components/Pagination";
import { toast } from "react-toastify";
import Spinner from "../components/UI/Spinner";
import { PaginatedRoleResponse, Ruolo } from "../model/role";

const RoleList: React.FC = () => {
  const [modalTitle, setModalTitle] = useState("");
  const [params, setParams] = useState<{ page?: number; limit?: number }>({
    page: 1,
    limit: 10,
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { mutate: deleteRoleMutate } = useMutation(deleteRole);

  const [selectedRole, setSelectedRole] = useState<Ruolo | null>(null);
  const {
    data: roleList,
    isLoading,
    error,
  } = useQuery(["rolesList", params], async () => await getRoleList(params), {
    keepPreviousData: true,
    staleTime: 5000, // 5 secondi
  });
  const navigate = useNavigate();

  const handleDeleteRole = (id: number) => {
    deleteRoleMutate(id, {
      onSuccess: (data, variables) => {
        toast.success(data.message);
        queryClient.setQueryData<PaginatedRoleResponse>(
          ["rolesList", params],
          (oldData): PaginatedRoleResponse => {
            if (!oldData) {
              return {
                roles: [],
                currentPage: 1,
                totalPages: 0,
                totalRoles: 0,
              };
            }
            const updatedRoles = oldData.roles.filter(
              (r) => r.id !== variables,
            );
            return {
              ...oldData,
              roles: updatedRoles,
              totalRoles: oldData.totalRoles - 1,
              totalPages: Math.ceil((oldData.totalRoles - 1) / params.limit!),
            };
          },
        );
      },
    });
  };

  const openCancelModal = (role: Ruolo) => {
    setSelectedRole(role);
    setIsModalOpen(true);
    setModalTitle(`Elimina ruolo con nome ${role.nome.toUpperCase()}`);
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
          onDeleteApi={handleDeleteRole}
          isOpen={isModalOpen}
          body="Confermi di voler eliminare il ruolo selezionato?"
          setIsModalOpen={setIsModalOpen}
          selectedItem={selectedRole}
          setSelectedList={setSelectedRole}
        />
        <div className="w-[80%] px-4 py-10 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-end">
            <div className="sm:flex-auto">
              <h1 className="font-montserrat text-2xl font-semibold leading-6 text-gray-900 sm:text-3xl">
                Lista Ruoli
              </h1>
              <p className="mt-2 font-montserrat text-sm text-gray-700 sm:text-base">
                Gestisci i ruoli presenti nell'applicativo
              </p>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:mt-0">
              <AnimatedButton
                icon={<PlusIcon className="mr-2 h-6 w-6" />}
                onClick={() => navigate("/role-new")}
                className="bg-purplue text-white hover:bg-darkPurplue"
              >
                Nuovo Ruolo
              </AnimatedButton>
            </div>
          </div>

          {!isLoading && roleList?.roles.length === 0 && (
            <div className="mt-10 text-center text-xl font-normal">
              Nessun Ruolo presente
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
          {!isLoading && roleList && roleList?.roles.length > 0 && (
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
                            Funzionalità
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
                        {roleList.roles.map((r: Ruolo) => (
                          <tr key={r.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-left font-montserrat text-sm font-medium capitalize text-gray-500 sm:pl-6">
                              {r.nome}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-left font-montserrat text-sm text-gray-500">
                              {r.features?.map((fp, index) => (
                                <div key={index}>
                                  {fp.name} -{" "}
                                  {fp.permissionId === 3
                                    ? "Scrittura"
                                    : "Lettura"}
                                </div>
                              ))}
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
                                    navigate(`/role-edit/${r.id}`);
                                  }}
                                  className="hover:bg-purplue"
                                ></AnimatedButton>
                              </Tooltip>

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
                                  onClick={() => openCancelModal(r)}
                                />
                              </Tooltip>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <Pagination
                  totalPages={roleList.totalPages}
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

export default RoleList;
