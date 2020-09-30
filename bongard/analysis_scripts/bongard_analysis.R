library(tidyverse)
library(here)
library(lme4)
library(AICcmodavg)
library(cowplot)
theme_set(theme_cowplot())

#read in data
d <- read.csv(here::here("data","bongard_nameability_data.csv"))

#unify naming of problems in accordance with Bongard's naming scheme
d$problem <- ifelse(d$problem=="prac2","p002",
                 ifelse(d$problem=="prac3","p003",
                        ifelse(d$problem=="prac9","p009",as.character(d$problem))))


#calculate average verbal complexity (averaging across responses for the left and right page)
d$verbalComplexity <- rowMeans(d[,c("contentWordLenLRespNoBe","contentWordLenRRespNoBe")])
d$verbalUniqueness <- rowMeans(d[,c("uniqueContentWordNoBePercLCor","uniqueContentWordNoBePercRCor")])

#compute average for each problem (for all responses and for correct responses only)
d <- d %>%
  group_by(problem) %>%
  mutate(
    verbalComplexityAve=mean(verbalComplexity),
    verbalComplexityAveCor=mean(verbalComplexity[isRight==1]))

#summarize across problems
problems_summary <- d %>%
  group_by(problem) %>%
  summarize(acc=mean(isRight),
           verbalComplexityAveCor=verbalComplexityAveCor[1],
           verbalComplexityAve=verbalComplexityAve[1],
           verbalUniqueness=verbalUniqueness[1])

# predict accuracy from verbal complexity / average number of content words for correct responses
m <- glmer(isRight~verbalComplexityAveCor+(1+verbalComplexityAveCor|subjCode)+(1|problem), data=d, family=binomial)
summary(m) 

#plot
#set up predictions data frame
pX <- expand.grid(verbalComplexityAveCor=seq(2,7,by=0.1))
predictions <- predictSE(m,pX,re.form=NA, type="response")
pX$fit <- predictions$fit
pX$se.fit <- predictions$se.fit
p1 <- ggplot(data=d,aes(verbalComplexityAveCor,fit))+
  geom_point(data=problems_summary ,aes(y=acc),size=5,color="seagreen")+
  #geom_text(data=problems_summary,aes(y=acc+0.05,label=problem),size=7)+
  geom_smooth(data=pX,aes(y=fit,ymax=fit+se.fit,ymin=fit-se.fit),stat="identity",color="black",size=2)+
  theme_classic(base_size=18)+
  ylab("Accuracy on Bongard Problem")+
  xlab("Average Number of Content Words")+
  ylim(-0.05,1.05)

#predict accuracy from naming uniqueness/ naming divergence
m <- glmer(isRight~verbalUniqueness+(1+verbalUniqueness|subjCode)+(1|problem), data=d, family=binomial)
summary(m) 

#plot
#set up predictions data frame
pX <- expand.grid(verbalUniqueness=seq(min(d$verbalUniqueness),max(d$verbalUniqueness),by=0.01))
predictions <- predictSE(m,pX,re.form=NA, type="response")
pX$fit <- predictions$fit
pX$se.fit <- predictions$se.fit
p2 <- ggplot(data=d,aes(verbalUniqueness,fit))+
  geom_point(data=problems_summary,aes(y=acc),size=5,color="seagreen")+
  #geom_text(data=problems_summary,aes(y=acc+0.05,label=problem),size=7)+
  geom_smooth(data=pX,aes(y=fit,ymax=fit+se.fit,ymin=fit-se.fit),stat="identity",color="black",size=2)+
  theme_classic(base_size=18)+
  ylab("Accuracy on Bongard Problem")+
  xlab("Naming Divergence of Content Words")+
  ylim(-0.05,1.05)
plot_grid(p1,p2,labels=c("A","B"), label_size=24)
ggsave(here("figures","Bongard_uniqueness_complexity_glmer.jpg"),width=14,height=6)