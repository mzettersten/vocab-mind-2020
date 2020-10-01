library(tidyverse)
library(lme4)
library(cowplot)
theme_set(theme_cowplot())
library(here)

#### Fleming shapes analysis ####

#overall summarized results
sumD <-  read.csv(here("data","FlemingTriadNameability.csv"))

#model/ compute correlation
cor.test(sumD$isSurface,sumD$surfaceMatchIndLenCWB)

#plot
p1 <- ggplot(sumD,aes(surfaceMatchIndLenCWB,isSurface))+
  geom_point(size=4,color="seagreen")+
  geom_smooth(method="lm",color="black",size=2)+
  theme_classic()+
  ylab("Probability of Surface Choice")+
  xlab("Average Content Word Length of Standard's Surface Description")+
  annotate("text",x=2.5,y=0.6,label="r=-.69, t(15)=-3.54, p<.01",size=4)

ggsave(here("figures","fleming.jpg"),width=6,height=6)

#trial-by-trial analysis (same data)
d <- read.csv(here("data","FlemingTriadNameability_indResp_anonymized.csv"))
m <- glmer(isSurface~surfaceMatchIndLenCWB+(1|ResponseID)+(1|trialID),data=d,family=binomial)
summary(m)
