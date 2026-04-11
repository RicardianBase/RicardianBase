import { useQuery } from "@tanstack/react-query";
import { getHealth } from "@/api/health";

export const useBackendFeatures = () => {
  const query = useQuery({
    queryKey: ["backend-features"],
    queryFn: getHealth,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    ...query,
    supportsUsernames: query.data?.features?.usernames === true,
    supportsUserResolution: query.data?.features?.user_resolution === true,
    supportsMultiPartyContracts:
      query.data?.features?.multi_party_contracts === true,
    supportsContractJsonLd:
      query.data?.features?.contract_jsonld === true,
    supportsContractMcpFallback:
      query.data?.features?.contract_mcp_manual_fallback === true,
  };
};
