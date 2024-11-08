import axios, { AxiosError } from "axios";
import { PaginatedUsersResponse, UserQueryParams, Utente } from "../model/user";
import { toast } from "react-toastify";
import axiosInstance from "./interceptor/Interceptor";
import { PaginatedRoleResponse, Ruolo } from "../model/role";
import { FeatureOptions, FeatureWithPermissions } from "../model/feature";

const BASE_URL = `${import.meta.env.VITE_BE}`;
export async function loginApi(
  email: string,
  password: string,
): Promise<Utente> {
  try {
    const res = await axios.post<Utente>(`${BASE_URL}login`, {
      email,
      password,
    });
    return res.data;
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data) {
      toast.error(err.response?.data.error, { position: "bottom-center" });
      console.log(err);
    }
    return Promise.reject(err);
  }
}

export async function refreshTokenApi(refresh: string): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  // try {
  const res = await axiosInstance.post<{
    accessToken: string;
    refreshToken: string;
  }>(
    `${BASE_URL}refresh-token`,
    { refreshToken: refresh },
    {
      // headers: {
      //   Authorization: `Bearer ${refresh}`,
      //   "Content-Type": "application/json",
      // },
    },
  );
  return res.data;
  // } catch (err) {
  //   return Promise.reject(err);
  // }
}

export async function getUserById(id: string): Promise<Utente> {
  const res = await axiosInstance.get<Utente>(`${BASE_URL}user/${id}`);
  return res.data;
}

export async function getUsers(
  params: UserQueryParams,
): Promise<PaginatedUsersResponse> {
  const res = await axiosInstance.get<PaginatedUsersResponse>(
    `${BASE_URL}users`,
    {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        cognome: params.cognome || undefined,
        email: params.email || undefined,
      },
    },
  );
  return res.data;
}

export async function deleteUser(id: number) {
  const res = await axiosInstance.delete<{ message: string }>(
    `${BASE_URL}users/${String(id)}`,
  );
  return res.data;
}

export async function getRoles(): Promise<Ruolo[]> {
  const res = await axiosInstance.get<Ruolo[]>(`${BASE_URL}roles`);
  return res.data;
}

export async function getRoleList(
  params: Partial<{ page: number; limit: number }>,
): Promise<PaginatedRoleResponse> {
  const res = await axiosInstance.get<PaginatedRoleResponse>(
    `${BASE_URL}rolesList`,
    {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
      },
    },
  );
  return res.data;
}

export async function getFeatureList(
  params: Partial<{ page: number; limit: number }>,
): Promise<PaginatedRoleResponse> {
  const res = await axiosInstance.get<PaginatedRoleResponse>(
    `${BASE_URL}featuresList`,
    {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
      },
    },
  );
  return res.data;
}
export async function updateRole(
  role: Partial<Ruolo>,
): Promise<{ message: string }> {
  console.log(role, "update role");

  const res = await axiosInstance.put<{ message: string }>(
    `${BASE_URL}roles/${role.id}`,
    role,
  );
  return res.data;
}

export async function createRole(
  role: Partial<Ruolo>,
): Promise<{ message: string }> {
  console.log(role, "create");
  const res = await axiosInstance.post<{ message: string }>(
    `${BASE_URL}roles`,
    role,
  );
  return res.data;
}
export async function deleteRole(id: number) {
  const res = await axiosInstance.delete<{ message: string }>(
    `${BASE_URL}roles/${String(id)}`,
  );
  return res.data;
}

export async function registerUser(
  user: Partial<Utente>,
): Promise<{ message: string }> {
  const res = await axiosInstance.post<{ message: string }>(
    `${BASE_URL}register`,
    user,
  );
  return res.data;
}

export async function updateUser(
  user: Partial<Utente>,
): Promise<{ message: string }> {
  const res = await axiosInstance.put<{ message: string }>(
    `${BASE_URL}user/${user.id}`,
    user,
  );
  return res.data;
}

export async function getRoleById(id: string): Promise<Ruolo> {
  const res = await axiosInstance.get<Ruolo>(`${BASE_URL}roles/${id}`);
  return res.data;
}

export async function getFeatureOptions(): Promise<FeatureOptions[]> {
  const res = await axiosInstance.get<FeatureOptions[]>(
    `${BASE_URL}featuresOptions`,
  );
  return res.data;
}

export async function getFeatureTree(
  ruoloId: number,
): Promise<FeatureWithPermissions[]> {
  const ruoloIdParam = String(ruoloId);
  const res = await axiosInstance.get<FeatureWithPermissions[]>(
    `${BASE_URL}features`,
    {
      params: {
        roleId: ruoloIdParam
      },
    },
  );
  return res.data;
}
