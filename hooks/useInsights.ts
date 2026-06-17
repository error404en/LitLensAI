import { useQuery, useMutation } from "@tanstack/react-query";
import { InsightsService, InsightType } from "../services/insights.service";
import { useAuth } from "@clerk/nextjs";

export const useInsights = (projectId: string) => {
  const { userId } = useAuth();

  const insightsQuery = useQuery({
    queryKey: ["project-insights", projectId],
    queryFn: () => InsightsService.getInsights(projectId),
    enabled: !!projectId,
  });

  const generateInsightMutation = useMutation({
    mutationFn: (type: InsightType) => {
      if (!userId) throw new Error("Unauthorized");
      return InsightsService.generateInsight(projectId, type, userId);
    },
  });

  return {
    insights: insightsQuery.data,
    isLoadingInsights: insightsQuery.isLoading,
    generateInsight: generateInsightMutation.mutateAsync,
    isGenerating: generateInsightMutation.isPending,
  };
};
