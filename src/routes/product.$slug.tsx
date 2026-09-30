import { createFileRoute } from "@tanstack/react-router";
import { NexaStore, products } from "./nexa";

export const Route = createFileRoute("/product/$slug")({
  ssr: false,
  head: ({ params }) => {
    const slug = params?.slug || "";
    const prod = products.find(
      (p) =>
        p.name.toLowerCase().replace(/\s+/g, "-") === slug ||
        p.id === Number(slug)
    );
    return {
      meta: [
        { title: `${prod ? prod.name : "Product"} — NEXA` },
        {
          name: "description",
          content: prod ? prod.tagline : "NEXA Premium Technology",
        },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const prod =
    products.find(
      (p) =>
        p.name.toLowerCase().replace(/\s+/g, "-") === slug ||
        p.id === Number(slug)
    ) || products.find((p) => p.name === "Nexa Watch S") || products[0];

  return <NexaStore initialProduct={prod} />;
}

export default ProductDetailPage;
