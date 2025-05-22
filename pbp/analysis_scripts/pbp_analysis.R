#PBP analysis
library(tidyverse)
library(here)
library(cowplot)
theme_set(theme_cowplot())
library(lme4)
library(AICcmodavg)
library(ggrepel)

#### PBP VERBAL SOLUTIONS ####
#read in data
#naming data
d <-  read.csv(here("data","PBP_naming_verbalIndividualResponse_anonymized.txt"), sep="\t")
#summarized accuracy in solving PBPs (for convenience, using pre-computed summary)
sumD <- read.csv(here("data","PBP_naming_accuracy_summarized.txt"), sep="\t")

#predict PBP solution probability from naming of simplified problems
m <- glmer(isRight~aveCWordLengthNBCor+(1+aveCWordLengthNBCor|ResponseID)+(1|trial), data=subset(d, exampleIsRight==1), family=binomial)
summary(m) #significant

#correlation on summarized data
cor.test(sumD[,c("acc")],sumD[,c("aveCWordLengthNBCor")])

#plot
#set up predictions data frame
problemsToPlot <- c("pbp04","pbp09","pbp11b","pbp19")
sumD$labelForPlot <- ifelse(sumD$trial %in% problemsToPlot,as.character(sumD$trial),NA)
pX <- expand.grid(aveCWordLengthNBCor=seq(2,4.5,by=0.1))
predictions <- predictSE(m,pX,re.form=NA, type="response")
pX$fit <- predictions$fit
pX$se.fit <- predictions$se.fit
ggplot(data=d,aes(aveCWordLengthNBCor,fit))+
  geom_point(data=sumD,aes(y=acc),size=5,color="seagreen")+
  geom_smooth(data=pX,aes(y=fit,ymax=fit+se.fit,ymin=fit-se.fit),stat="identity",color="black",size=2)+
  geom_text(data=sumD,aes(y=acc-0.03,label=labelForPlot),size=7)+
  theme_classic(base_size=18)+
  ylab("Accuracy of Verbal Solutions \non Original Physical Bongard Problem")+
  xlab("Average Number of Content Words for Solutions to Simplified Problems")
ggsave(here("figures","pbp_naming_accuracy_1.jpg"),width=10,height=6)

#plot 2
#slightly modified labels for data points
sumD$number <- gsub("pbp","",sumD$trial)
sumD$number <- gsub("0","",sumD$number)
sumD$number <- gsub("b","",sumD$number)
ggplot(data=d,aes(aveCWordLengthNBCor,fit))+
  geom_point(data=sumD,aes(y=acc),size=5,color="seagreen")+
  geom_smooth(data=pX,aes(y=fit,ymax=fit+se.fit,ymin=fit-se.fit),stat="identity",color="black",size=2)+
  geom_text_repel(data=sumD,aes(y=acc,label=number),size=7)+
  theme_classic(base_size=18)+
  ylab("Accuracy of Verbal Solutions \non Original Physical Bongard Problem")+
  xlab("Average Number of Content Words for Solutions to Simplified Problems")
ggsave(here("figures","pbp_naming_accuracy_2.jpg"),width=10,height=6)


#### SORTING TASK ####
#predicting accuracy - test performance on sorting task
#trial-by-trial data
test <- read.csv(here("data","PBPSort_forAnalysis_anonymized.txt"),sep="\t")
#rename problem column
colnames(test)[colnames(test)=="problem_type"] <- "trial"
#merge with summarized nameability data
test <- merge(test,sumD,by="trial")
#dataset with verbal solutions coded for accuracy
test_coded <- read.csv(here("data","PBPSort_forAnalysis_verbalSolutionCoded_anonymized.txt"),sep="\t")

#predict sorting accuracy at test from nameability/ verbal complexity
m=glmer(dropCorrect~aveCWordLengthNBCor+(1|subject)+(1|trial),data=subset(test,trial_type=="test-sort"),family=binomial)
summary(m)

#predict accuracy of verbal solution from nameability/ verbal complexity
m=glmer(isRight~aveCWordLengthNBCor+(1|problem), data=test_coded ,family=binomial)
summary(m)

#### NOT REPORTED IN CHAPTER ####

# Correlations between verbal complexity and accuracy for the PBP sorting task

## summarize data by problem to compute correlations

### average sorting accuracy
test_sorting_avg <- test %>%
  group_by(trial,aveCWordLengthNBCor) %>%
  summarize(
    avg_sorting_accuracy = mean(dropCorrect)
  )

#### sorting accuracy correlation w/ verbal complexity
cor.test(test_sorting_avg$avg_sorting_accuracy,test_sorting_avg$aveCWordLengthNBCor)

### average verbal solution accuracy
test_coded_avg <- test_coded %>%
  group_by(problem,aveCWordLengthNBCor) %>%
  summarize(
    avg_verbal_solution_accuracy = mean(isRight)
  )

#### sorting accuracy correlation w/ verbal complexity
cor.test(test_coded_avg$avg_verbal_solution_accuracy,test_coded_avg$aveCWordLengthNBCor)

