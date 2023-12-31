import React, { useState, useRef } from "react";
import axios from "axios";
import "./FormEvent.scss";



// const pica = require('pica')();

const bucket = "https://master-events-img.s3.amazonaws.com/";
const api = "http://localhost:8080/event";
const varaccessKeyId = "AKIAUNATVL73E5UJPETB";
const varsecretAccessKey = "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";



const EventForm = () => {
  const fileInputRef = useRef(null);

  const initialFormData = {
    nameEvent: "",
    description: "",
    location: "",
    city: "",
    date: "",
    category: "",
    minimumAge: "",
    address: "",
    openTime: "",
    images: [],
  };
  const [formData, setFormData] = useState({
    nameEvent: "",
    description: "",
    location: "",
    city: "",
    date: "",
    category: "",
    minimumAge: "",
    address: "",
    openTime: "",
    images: [],
  });

  const [formMessage, setFormMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const [nameEventError, setNameEventError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [cityError, setCityError] = useState("");
  const [dateError, setDateError] = useState("");
  const [openTimeError, setOpenTimeError] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [minimumAgeError, setMinimumAgeError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [imagesError, setImagesError] = useState("");


  const isValidOpenTime = (time) => {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    return timeRegex.test(time);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "nameEvent") {
      if (value.trim() === "") {
        setNameEventError("El campo Nombre del Evento no puede estar vacío");
      } else {
        setNameEventError("");
      }
    } else if (name === "description") {
      if (value.trim() === "") {
        setDescriptionError("El campo Descripción no puede estar vacío");
      } else {
        setDescriptionError("");
      }
    } else if (name === "location") {
      if (value.trim() === "") {
        setLocationError("El campo Ubicación no puede estar vacío");
      } else {
        setLocationError("");
      }
    } else if (name === "city") {
      if (value.trim() === "") {
        setCityError("El campo Ciudad no puede estar vacío");
      } else {
        setCityError("");
      }
    } else if (name === "date") {
      if (value.trim() === "") {
        setDateError("El campo Fecha no puede estar vacío");
      } else {
        setDateError("");
      }
    } else if (name === "openTime") {
      if (!isValidOpenTime(value)) {
        setOpenTimeError("El formato debe ser 00:00:00");
      } else {
        setOpenTimeError("");
      }
    } else if (name === "category") {
      if (value.trim() === "") {
        setCategoryError("El campo Categoría no puede estar vacío");
      } else {
        setCategoryError("");
      }
    } else if (name === "minimumAge") {
      if (value.trim() === "") {
        setMinimumAgeError("El campo Edad Mínima no puede estar vacío");
      } else {
        setMinimumAgeError("");
      }
    } else if (name === "address") {
      if (value.trim() === "") {
        setAddressError("El campo Dirección no puede estar vacío");
      } else {
        setAddressError("");
      }
    }
  };



  // const handleImageChange = (e) => {
  //   const images = e.target.files;
  //   const resizedImages = [];

  //   if (images.length === 0) {
  //     setImagesError("Debe cargar al menos un archivo.");
  //     return;
  //   } else {
  //     setImagesError(""); // Reiniciar el mensaje de error
  //   }

  //   for (const image of images) {
  //     resizeImages([image]).then((resizedImage) => {
  //       resizedImages.push(...resizedImage);

  //       if (resizedImages.length === images.length * 3) {
  //         setFormData({ ...formData, images: resizedImages });
  //       }
  //     });
  //   }
  // };

  const handleImageChange = (e) => {
    const images = e.target.files;
    const resizedImages = [];

    if (images.length === 0) {
      setImagesError("Debe cargar al menos un archivo.");
      return;
    } else {
      setImagesError(""); // Reiniciar el mensaje de error
    }

    const specialCharacterRegex = /[^a-zA-Z0-9\._-]/; // Expresión regular para caracteres especiales

    for (const image of images) {
      if (specialCharacterRegex.test(image.name)) {
        setImagesError("El nombre del archivo contiene caracteres especiales y no se puede mostrar.");
        return;
      }

      resizeImages([image]).then((resizedImage) => {
        resizedImages.push(...resizedImage);

        if (resizedImages.length === images.length * 3) {
          setFormData({ ...formData, images: resizedImages });
        }
      });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nameEvent) {
      setNameEventError("El campo Nombre del Evento no puede estar vacío");
      return;
    }
    if (!formData.description) {
      setDescriptionError("El campo Descripción no puede estar vacío");
      return;
    }
    if (!formData.location) {
      setLocationError("El campo localizacion no puede estar vacío");
      return;
    }
    if (!formData.city) {
      setCityError("El campo Ciudad no puede estar vacío");
      return;
    }
    if (!formData.date) {
      setDateError("El campo Fecha no puede estar vacío");
      return;
    }
    if (!formData.category) {
      setCategoryError("El campo Categoria no puede estar vacío");
      return;
    }
    if (!formData.minimumAge) {
      setMinimumAgeError("El campo Edad minima no puede estar vacío");
      return;
    }
    if (!formData.address) {
      setAddressError("El campo Dirección no puede estar vacío");
      return;
    }
    if (!formData.openTime) {
      setOpenTimeError("El campo hora de apertura no puede estar vacío");
      return;
    }

    if (formData.images.length === 0) {
      setImagesError("Se debe cargar un archivo de imagen");
      return;
    }




    const validImages = formData.images.filter((image) => image.blob !== null);


    const updatedImages = validImages.map((image) => {
      return { url: bucket+image.filename };
    });

    const formDataToSend = {
      nameEvent: formData.nameEvent,
      description: formData.description,
      location: formData.location,
      city: formData.city,
      date: formData.date,
      category: formData.category,
      minimumAge: formData.minimumAge,
      address: formData.address,
      openTime: formData.openTime,
      images: updatedImages,
    };


    try {
      const response = await axios.post(api, formDataToSend);

      console.log("Evento creado con éxito:", response.data);
      setFormMessage("Evento creado con éxito: ");
      setIsError(false);
      setFormData(initialFormData);

      // Restablecer el campo adicionar archivo
      fileInputRef.current.value = "";

      // Redimensionar y cargar imágenes en AWS S3
      await uploadImagesToS3(validImages);
    } catch (error) {
      console.error("Error al crear el evento:", error);
      setFormMessage("Error al crear el evento: ");
      setIsError(true);
    }
  };


//************************************************************************* */

const resizeImages = async (images) => {

  const sizes = [
    { width: 1230, height: 447, name: 1230 },
    { width: 327, height: 218, name: 327 },
    { width: 600, height: 254, name: 600 },
  ];

  const resizedImages = [];

  for (const image of images) {
    const nombreArchivo = image.name;
    const ext = nombreArchivo.split('.').pop();
    const primeraParte = nombreArchivo.replace(`.${ext}`, '');

    for (const size of sizes) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = URL.createObjectURL(image);

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      canvas.width = size.width || (size.height * img.width) / img.height;
      canvas.height = size.height || (size.width * img.height) / img.width;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Aplicar el enfoque (sharpen) a la imagen redimensionada
      // sharpenImage(ctx, canvas.width, canvas.height);

      const resizedBlob = await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          `image/${ext}`, // Utiliza la extensión del archivo como formato
          { quality: 0.9 } // Ajusta la calidad según tus necesidades
        );
      });

      // Genera un nombre de archivo único para la imagen redimensionada
      const filename = `${primeraParte}_${size.name}.${ext}`;

      resizedImages.push({
        blob: resizedBlob,
        filename: filename,
      });
    }
  }

  return resizedImages;
};

// Función de enfoque simple
function sharpenImage(ctx, width, height) {
  const data = ctx.getImageData(0, 0, width, height);
  const pixels = data.data;

  // Matriz de enfoque
  const matrix = [0, -1, 0, -1, 5, -1, 0, -1, 0];

  const factor = 1;
  const bias = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    let newR = 0,
      newG = 0,
      newB = 0;

    for (let row = -1; row <= 1; row++) {
      for (let col = -1; col <= 1; col++) {
        const offset = (row + 1) * 3 + col + 1;
        const neighborR = pixels[i + offset * 4];
        const neighborG = pixels[i + offset * 4 + 1];
        const neighborB = pixels[i + offset * 4 + 2];

        newR += neighborR * matrix[offset];
        newG += neighborG * matrix[offset];
        newB += neighborB * matrix[offset];
      }
    }

    pixels[i] = Math.min(255, Math.max(0, factor * newR + bias));
    pixels[i + 1] = Math.min(255, Math.max(0, factor * newG + bias));
    pixels[i + 2] = Math.min(255, Math.max(0, factor * newB + bias));
  }

  ctx.putImageData(data, 0, 0);
}



  //************************************************************************* */



  const uploadImagesToS3 = async (images) => {
    const AWS = require("aws-sdk");
    AWS.config.update({
      accessKeyId: varaccessKeyId,
      secretAccessKey: varsecretAccessKey,
      region: "us-east-1",
    });

    const s3 = new AWS.S3();

    for (const image of images) {
      const params = {
        Bucket: "master-events-img",
        Key: image.filename,
        Body: image.blob,
      };

      await s3.upload(params).promise();
    }
  };


  return (

    <div className="form-container">

      <p className={`message ${isError ? "error-message" : "messageok"}`}>{formMessage}</p>

      <h1>Adicionar Evento</h1>
      <form onSubmit={handleSubmit}>
        <div className="inpuEvent">
          <input
            type="text"
            name="nameEvent"
            value={formData.nameEvent}
            onChange={handleInputChange}
            placeholder="Nombre del evento"
          />
           {nameEventError && <p className="error-message">{nameEventError}</p>}
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Descripción"
          />
          {descriptionError && <p className="error-message">{descriptionError}</p>}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            placeholder="Ubicación"
          />
          {locationError && <p className="error-message">{locationError}</p>}
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Ciudad"
          />
          {cityError && <p className="error-message">{cityError}</p>}
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            placeholder="Fecha"
          />
          {dateError && <p className="error-message">{dateError}</p>}
          <input
            type="text"
            name="openTime"
            value={formData.openTime}
            onChange={handleInputChange}
            placeholder="Hora de apertura 00:00:00"
          />
          {openTimeError && <p className="error-message">{openTimeError}</p>}
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Categoría"
          />
          {categoryError && <p className="error-message">{categoryError}</p>}
          <input
            type="number"
            name="minimumAge"
            value={formData.minimumAge}
            onChange={handleInputChange}
            placeholder="Edad mínima"
          />
          {minimumAgeError && <p className="error-message">{minimumAgeError}</p>}
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Dirección"
          />
          {addressError && <p className="error-message">{addressError}</p>}

          <input type="file" multiple name="images" onChange={handleImageChange} ref={fileInputRef} />
          {imagesError && <p className="error-message">{imagesError}</p>}
        </div>
          <button type="submit">Crear Evento</button>
      </form>
    </div>
  );
};

export default EventForm;
