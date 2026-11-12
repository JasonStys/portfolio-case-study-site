/**
 * @file Loads only the hub's independent public delivery projection; absent facts remain explicitly null.
 * Functions: module validation; variables: portfolioDeliveryManifest. Line locations: docs/CODE_INDEX.md.
 */
import raw from "@/data/portfolio-delivery.json";
import { validatePortfolioDelivery } from "./portfolio-delivery";

export const portfolioDeliveryManifest = validatePortfolioDelivery(raw);
