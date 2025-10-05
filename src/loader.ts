import expressLoader from "@/express";
import { LoaderProps } from "@/common/types/props.type.";

export default ({ services }: LoaderProps) => {
  expressLoader({ services });
};
