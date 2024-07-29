import axios, { AxiosResponse, AxiosInstance } from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BASE_API_URL || "http://localhost:5122";

type LoginType = {
  username: string;
  password: string;
};

type LoginResponseType = {
  status: number;
  message: string;
  data?: {
    username: string;
    user_uuid: string;
    token: string;
  };
};

type AllResponseType = {
  status: number;
  message: string;
  data?: {
    putra: number;
    putri: number;
    sekolah: number;
  };
};

type SchoolResponseType = {
  status: number;
  message: string;
  data?: SchoolUpdateType[];
};

type SantriType = {
  santri_uuid: string;
  name: string;
  nis: string;
  address: string;
  parent: string;
  gender: string;
  yatim: boolean;
  school_name: string;
  school_uuid: string;
};

type SantriByGenreResponseType = {
  status: number;
  message: string;
  data?: {
    santri: SantriType[];
    school: SchoolUpdateType[];
  };
};

type SantriByNisResponseType = {
  status: number;
  message: string;
  data?: {
    santri: SantriType;
    tagihan: {
      total: number;
      spp: {
        spp_uuid: string;
        year: string;
        month: string;
        nominal_spp: number;
        nominal_kosma: number;
        total: number;
      }[];
    };
  };
};

type CheckTokenResponseType = {
  status: number;
  message: string;
};

type SchoolAddType = {
  name: string;
};

type SantriAddType = {
  school_uuid: string;
  santri_uuid?: string;
  name: string;
  nis: string;
  address: string;
  parent: string;
  gender: string;
  yatim: boolean;
};

type SchoolUpdateType = {
  name: string;
  school_uuid: string;
};

type PaymentResponseType = {
  status: number;
  message: string;
  data?: {
    spp: {
      year: string;
      month: string;
      nominal_spp: number;
      nominal_kosma: number;
      spp_uuid: string;
    }[];
    santri: {
      santri_uuid: string;
      name: string;
      gender: string;
      total: number;
      spp: {
        spp_uuid: string;
        year: string;
        month: string;
        total: number;
        spp_santri_uuid: string;
      }[];
    }[];
  };
};

type PaymentAddType = {
  month: string;
  year: string;
  nominal_spp: number;
  nominal_kosma: number;
};

type SppSantriType = {
  santri_uuid: string;
  spp_uuid: string;
  spp_santri_uuid: string;
};

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log(error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      return Promise.reject({
        status: 504,
        message: "No response received from the server",
      });
    } else {
      return Promise.reject({
        status: 500,
        message: "An unexpected error occurred",
      });
    }
  }
);

const login = async (data: LoginType): Promise<LoginResponseType> => {
  const login_endpoint = "/users/login";
  try {
    const res: AxiosResponse<LoginResponseType> = await apiClient.post(
      login_endpoint,
      data
    );
    return res.data;
  } catch (error) {
    return error as LoginResponseType;
  }
};

const checkToken = async (): Promise<CheckTokenResponseType> => {
  const check_endpoint = "/users/check";
  try {
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.get(
      check_endpoint
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

const addSchool = async (
  data: SchoolAddType
): Promise<CheckTokenResponseType> => {
  const school_endpoint = "/santri/school";
  try {
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.post(
      school_endpoint,
      data
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

const updateSchool = async (
  data: SchoolUpdateType
): Promise<CheckTokenResponseType> => {
  const school_endpoint = "/santri/school";
  try {
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.put(
      school_endpoint,
      data
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

const addSantri = async (
  data: SantriAddType
): Promise<CheckTokenResponseType> => {
  const santri_endpoint = "/santri/";
  try {
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.post(
      santri_endpoint,
      data
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

const updateSantri = async (
  data: SantriAddType
): Promise<CheckTokenResponseType> => {
  const santri_endpoint = "/santri/";
  try {
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.put(
      santri_endpoint,
      data
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

const addSppPayment = async (
  data: PaymentAddType
): Promise<CheckTokenResponseType> => {
  const spp_endpoint = "/spp/";
  try {
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.post(
      spp_endpoint,
      data
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

const addSppSantri = async (
  data: SppSantriType[]
): Promise<CheckTokenResponseType> => {
  const spp_endpoint = "/spp/santri";
  try {
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.post(
      spp_endpoint,
      data
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

const getAll = async (): Promise<AllResponseType> => {
  const all_endpoint = "/santri/all";
  try {
    const res: AxiosResponse<AllResponseType> = await apiClient.get(
      all_endpoint
    );
    return res.data;
  } catch (error) {
    return error as AllResponseType;
  }
};

const getAllScholl = async (): Promise<SchoolResponseType> => {
  const all_endpoint = "/santri/school";
  try {
    const res: AxiosResponse<SchoolResponseType> = await apiClient.get(
      all_endpoint
    );
    return res.data;
  } catch (error) {
    return error as SchoolResponseType;
  }
};

const getSantriByGender = async (
  gender: string
): Promise<SantriByGenreResponseType> => {
  const all_endpoint = `/santri/bygender?g=${gender}`;
  try {
    const res: AxiosResponse<SantriByGenreResponseType> = await apiClient.get(
      all_endpoint
    );
    return res.data;
  } catch (error) {
    return error as SantriByGenreResponseType;
  }
};

const getPayment = async (): Promise<PaymentResponseType> => {
  const paymnet_enpoint = "/spp/santri";
  try {
    const res: AxiosResponse<PaymentResponseType> = await apiClient.get(
      paymnet_enpoint
    );
    return res.data;
  } catch (error) {
    return error as PaymentResponseType;
  }
};

const getSantriByNis = async (
  nis: string
): Promise<SantriByNisResponseType> => {
  const paymnet_enpoint = `/santri/bynis?nis=${nis}`;
  try {
    const res: AxiosResponse<SantriByNisResponseType> = await apiClient.get(
      paymnet_enpoint
    );
    return res.data;
  } catch (error) {
    return error as SantriByNisResponseType;
  }
};

const uploadImage = async (
  image: File | null,
  uuid: string
): Promise<CheckTokenResponseType> => {
  const upload_enpoint = "/spp/upload";
  try {
    const formData = new FormData();
    formData.append("image", image || "");
    formData.append("uuid", uuid);
    const res: AxiosResponse<CheckTokenResponseType> = await apiClient.post(
      upload_enpoint,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return res.data;
  } catch (error) {
    return error as CheckTokenResponseType;
  }
};

export {
  login,
  checkToken,
  getAll,
  getAllScholl,
  getSantriByGender,
  getSantriByNis,
  addSchool,
  updateSchool,
  addSantri,
  updateSantri,
  getPayment,
  addSppPayment,
  addSppSantri,
  uploadImage,
};
