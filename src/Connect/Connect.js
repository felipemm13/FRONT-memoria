import axios from "axios";

class Connect {
  #baseUrlApi = process.env.NEXT_PUBLIC_APIZONE; // Asegúrate de que el nombre de la variable coincida con el que se usa en el código
  #headerName = process.env.NEXT_PUBLIC_HEADER;
  #token = process.env.NEXT_PUBLIC_TOKEN; // Nombre del encabezado para la autorización

  // Configuración común para las solicitudes
  #config = {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      [this.#headerName]: this.#token, // Usa el nombre del encabezado y el token tal como están en el .env
    },
  };

  async post(path, data) {
    try {
      const url = `${this.#baseUrlApi}${path}`;

      const response = await axios.post(url, data, this.#config); // Usa la configuración común
      return response;
    } catch (error) {
      console.error("Error en la solicitud POST:", error);
      throw error;
    }
  }

  async get(path, params = {}) {
    try {
      const url = `${this.#baseUrlApi}${path}`;
      const config = { ...this.#config, params }; // Añade los parámetros de consulta a la configuración

      const response = await axios.get(url, config); // Usa la configuración común con los parámetros de consulta
      return response.data;
    } catch (error) {
      console.error("Error en la solicitud GET:", error);
      throw error;
    }
  }

  // Método para DELETE
  async delete(path) {
    try {
      const url = `${this.#baseUrlApi}${path}`;
      const response = await axios.delete(url, this.#config); // Usa la configuración común
      return response.data;
    } catch (error) {
      console.error("Error en la solicitud DELETE:", error);
      throw error;
    }
  }

  // Método para UPDATE (generalmente se usa PUT o PATCH)
  async update(path, data) {
    try {
      const url = `${this.#baseUrlApi}${path}`;
      const response = await axios.put(url, data, this.#config); // Aquí se usa PUT, pero podrías usar PATCH si es necesario
      return response.data;
    } catch (error) {
      console.error("Error en la solicitud UPDATE:", error);
      throw error;
    }
  }
}

export default Connect;
