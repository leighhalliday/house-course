import { useState, useEffect, ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Link from "next/link";
import { Image } from "cloudinary-react";
import { SearchBox } from "./searchBox";
import {
  CreateSpotMutation,
  CreateSpotMutationVariables,
} from "src/generated/CreateSpotMutation";
import {
  UpdateSpotMutation,
  UpdateSpotMutationVariables,
} from "src/generated/UpdateSpotMutation";
import { CreateSignatureMutation } from "src/generated/CreateSignatureMutation";

const SIGNATURE_MUTATION = gql`
  mutation CreateSignatureMutation {
    createImageSignature {
      signature
      timestamp
    }
  }
`;

const CREATE_SPOT_MUTATION = gql`
  mutation CreateSpotMutation($input: SpotInput!) {
    createSpot(input: $input) {
      id
    }
  }
`;

const UPDATE_SPOT_MUTATION = gql`
  mutation UpdateSpotMutation($id: String!, $input: SpotInput!) {
    updateSpot(id: $id, input: $input) {
      id
      image
      publicId
      latitude
      longitude
      sports
      address
    }
  }
`;

interface IUploadImageResponse {
  secure_url: string;
}

async function uploadImage(
  image: File,
  signature: string,
  timestamp: number
): Promise<IUploadImageResponse> {
  const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`;
  const formData = new FormData();
  formData.append("file", image);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp.toString());
  formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_KEY ?? "");

  const response = await fetch(url, {
    method: "post",
    body: formData,
  });
  return response.json();
}

interface IFormData {
  address: string;
  latitude: number;
  longitude: number;
  sports: string;
  image: FileList;
}

interface ISpot {
  id: string;
  address: string;
  latitude: number;
  longitude: number;
  sports: string;
  image: string;
  publicId: string;
}
interface IProps {
  spot?: ISpot;
}

export default function SpotForm({ spot }: IProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const { register, handleSubmit, setValue, errors, watch } = useForm<
    IFormData
  >({
    defaultValues: spot
      ? {
          address: spot.address,
          latitude: spot.latitude,
          longitude: spot.longitude,
          sports: spot.sports,
        }
      : {},
  });

  const address = watch("address");

  const [createSignature] = useMutation<CreateSignatureMutation>(
    SIGNATURE_MUTATION
  );

  const [createSpot] = useMutation<
    CreateSpotMutation,
    CreateSpotMutationVariables
  >(CREATE_SPOT_MUTATION);
  const [updateSpot] = useMutation<
    UpdateSpotMutation,
    UpdateSpotMutationVariables
  >(UPDATE_SPOT_MUTATION);

  useEffect(() => {
    register({ name: "address" }, { required: "Please enter an address" });
    register({ name: "latitude" }, { required: true, min: -90, max: 90 });
    register({ name: "longitude" }, { required: true, min: -180, max: 180 });
  }, [register]);

  const handleCreate = async (data: IFormData) => {
    // console.log({ data });
    const { data: signatureData } = await createSignature();
    if (signatureData) {
      const { signature, timestamp } = signatureData.createImageSignature;
      const imageData = await uploadImage(data.image[0], signature, timestamp);

      const { data: spotData } = await createSpot({
        variables: {
          input: {
            address: data.address,
            image: imageData.secure_url,
            coordinates: {
              latitude: data.latitude,
              longitude: data.longitude,
            },
            sports: data.sports,
          },
        },
      });

      if (spotData?.createSpot) {
        router.push(`/spots/${spotData.createSpot.id}`);
      }
    }
  };

  const handleUpdate = async (currentSpot: ISpot, data: IFormData) => {
    let image = currentSpot.image;

    if (data.image[0]) {
      const { data: signatureData } = await createSignature();
      if (signatureData) {
        const { signature, timestamp } = signatureData.createImageSignature;
        const imageData = await uploadImage(
          data.image[0],
          signature,
          timestamp
        );
        image = imageData.secure_url;
      }
    }

    const { data: spotData } = await updateSpot({
      variables: {
        id: currentSpot.id,
        input: {
          address: data.address,
          image: image,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude,
          },
          sports: data.sports,
        },
      },
    });

    if (spotData?.updateSpot) {
      router.push(`/spots/${currentSpot.id}`);
    }
  };

  const onSubmit = (data: IFormData) => {
    setSubmitting(true);
    if (!!spot) {
      handleUpdate(spot, data);
    } else {
      handleCreate(data);
    }
  };

  return (
    <form className="mx-auto max-w-xl py-4" onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-xl">
        {spot ? `Editing ${spot.address}` : "Add a New Spot"}
      </h1>
      <div className="mt-4">
        <label htmlFor="search" className="block">
          Fill in the address of the spot
        </label>
        <SearchBox
          onSelectAddress={(address, latitude, longitude) => {
            setValue("address", address);
            setValue("latitude", latitude);
            setValue("longitude", longitude);
          }}
          defaultValue={spot ? spot.address : ""}
        />
        {errors.address && <p>{errors.address.message}</p>}
      </div>

      {address && (
        <>
          <div className="mt-4">
            <label
              htmlFor="image"
              className="p-4 border-dashed border-4 border-grey block cursor-pointer"
            >
              Click to add image (16:9)
            </label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={register({
                validate: (fileList: FileList) => {
                  if (spot || fileList.length === 1) return true;
                  return "Please upload one file";
                },
              })}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                if (event?.target?.files?.[0]) {
                  const file = event.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setPreviewImage(reader.result as string);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            {previewImage ? (
              <img
                src={previewImage}
                className="mt-4 object-cover"
                style={{ width: "576px", height: `${(9 / 16) * 576}px` }}
              />
            ) : spot ? (
              <Image
                className="mt-4"
                cloudName={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}
                publicId={spot.publicId}
                alt={spot.address}
                secure
                dpr="auto"
                quality="auto"
                width={576}
                height={Math.floor((9 / 16) * 576)}
                crop="fill"
                gravity="auto"
              />
            ) : null}
            {errors.image && <p>{errors.image.message}</p>}
          </div>
          <div className="mt-4">
            <label htmlFor="sports" className="block">
              Sports
            </label>
            <input
              id="sports"
              name="sports"
              type="string"
              className="p-2"
              ref={register({
                required: "Please specify the sport",
              })}
            />
            {errors.sports && <p>{errors.sports.message}</p>}
          </div>
          <div className="mt-4">
            <button
              className="bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded"
              type="submit"
              disabled={submitting}
            >
              Save
            </button>{" "}
            <Link href={spot ? `/spots/${spot.id}` : "/"}>cancel</Link>
          </div>
        </>
      )}
    </form>
  );
}
