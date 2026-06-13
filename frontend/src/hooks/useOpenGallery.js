// src/hooks/useOpenGallery.js
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import productCatalogSets from "../data/productCatalogSets";
import productCatalogRamps from "../data/productCatalogRamps";
import productCatalogSkateparks from "../data/productCatalogSkateparks";

const ALL_CATALOGS = [
  ...productCatalogSets,
  ...productCatalogRamps,
  ...productCatalogSkateparks,
];

const CATALOGS = {
  sets: productCatalogSets,
  ramps: productCatalogRamps,
  skateparks: productCatalogSkateparks,
};

export function useOpenGallery() {
  const navigate = useNavigate();

  const openGallery = useCallback((type, activeProductIndex) => {
    const catalog = CATALOGS[type];
    if (!catalog) return;

    const currentProduct = catalog[activeProductIndex];
    if (!currentProduct) return;

    const globalIndex = ALL_CATALOGS.findIndex(
      (product) => product.id === currentProduct.id
    );

    if (globalIndex === -1) return;

    const startIndex = ALL_CATALOGS
      .slice(0, globalIndex)
      .reduce((acc, product) => acc + (product.sample?.length || 0), 0);

    navigate(`/gallery/${type}/${currentProduct.id}`, {
      state: { startIndex },
    });
  }, [navigate]);

  return openGallery;
}