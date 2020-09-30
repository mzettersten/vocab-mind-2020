source('summarizeData.R', echo=TRUE)
library(tidyverse)
library(dplyr)
library(here)
library(lme4)

#read in data
d <- read.csv(here::here("data","tL_v1_allData_processed.txt"), sep="\t")

#just look at first responses
dFirst <- subset(d,firstTrial==1)

#summarize by participant
subjBlock <-d %>% filter(firstTrial==1) %>%
  group_by(subject,condition,conditionC,FourBlock)  %>%
  summarise(accuracy = mean(dropCorrect))

#summarize across subjects
summarizedBlock <- summarySEwithin(subjBlock,"accuracy",withinvars="FourBlock",betweenvars="condition",idvar="subject")

p=ggplot(summarizedBlock, aes(FourBlock,accuracy,color=condition,group=condition))+
  geom_line(size=2,position=position_dodge(.05))+
  geom_errorbar(aes(ymin=accuracy-se,ymax=accuracy+se),width=0,size=0.75,position=position_dodge(.05))+
  geom_point(aes(fill=condition),size=4,position=position_dodge(.05))+
  theme_classic(base_size=24)+
  scale_color_brewer(palette="Set1",name="Condition",labels=c("T vs. L","rotated"))+
  scale_fill_brewer(palette="Set1",name="Condition",labels=c("T vs. L","rotated"))+
  xlab("Block")+
  ylab("Categorization Accuracy")+
  theme(legend.position=c(.7, .2),legend.text=element_text(size=16),legend.title=element_text(size=16,face="bold"))
ggsave(here::here("figures","tvsl_accuracy.jpg"),width=8,height=6)

#summarize across subjects
subj <-d %>% filter(firstTrial==1) %>%
  group_by(subject,condition,conditionC)  %>%
  summarise(Mean = mean(dropCorrect),
            Response1=strategy[1],
            Response2=shapes[2])

#subject summary
subj_summary <- subj %>%
  summarySE(groupvars=c("condition"),measurevar="Mean")

#test for condition effect
#logistic mixed-effects model
m=glmer(dropCorrect~conditionC+(1|subject)+(1+conditionC|imagePaired),data=dFirst,family=binomial)
summary(m)

#trial number by condition interaction
dFirst$totalTrialNumC=dFirst$totalTrialNum-mean(dFirst$totalTrialNum)
m=glmer(dropCorrect~conditionC*totalTrialNumC+(1+totalTrialNumC|subject)+(1+conditionC|imagePaired),data=dFirst,family=binomial)
summary(m)
#accuracy increases with trial and there is a main effect of condition,
#but no trial * condition interaction