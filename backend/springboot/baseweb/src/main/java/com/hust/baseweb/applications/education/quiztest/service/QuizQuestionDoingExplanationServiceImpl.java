package com.hust.baseweb.applications.education.quiztest.service;

import com.hust.baseweb.applications.contentmanager.model.ContentModel;
import com.hust.baseweb.applications.contentmanager.repo.MongoContentService;
import com.hust.baseweb.applications.education.quiztest.entity.QuizQuestionDoingExplanation;
import com.hust.baseweb.applications.education.quiztest.model.quizdoingexplanation.QuizDoingExplanationInputModel;
import com.hust.baseweb.applications.education.quiztest.repo.QuizQuestionDoingExplanationRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collection;
import java.util.UUID;

@Slf4j
@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class QuizQuestionDoingExplanationServiceImpl implements QuizQuestionDoingExplanationService {

    private final MongoContentService mongoContentService;

    private final QuizQuestionDoingExplanationRepo quizDoingExplanationRepo;

    @Override
    public Collection<QuizQuestionDoingExplanation> findExplanationByParticipantIdAndQuestionId(
        String studentLoginId,
        UUID questionId
    ) {
        Sort sortDescByCreatedTime = Sort.by(Sort.Direction.DESC, "createdStamp");
        return quizDoingExplanationRepo.findByParticipantUserIdAndQuestionId(
            studentLoginId,
            questionId,
            sortDescByCreatedTime);
    }

    @Override
    public QuizQuestionDoingExplanation createExplanation(QuizDoingExplanationInputModel explanation,
                                                          MultipartFile attachment) {
        QuizQuestionDoingExplanation newQuizDoingExplanation = new QuizQuestionDoingExplanation();
        newQuizDoingExplanation.setQuestionId(explanation.getQuestionId());
        newQuizDoingExplanation.setParticipantUserId(explanation.getParticipantUserId());
        newQuizDoingExplanation.setTestId(explanation.getTestId());
        newQuizDoingExplanation.setSolutionExplanation(explanation.getExplanationContent());
        setAttachment(newQuizDoingExplanation, attachment);
        return quizDoingExplanationRepo.save(newQuizDoingExplanation);
    }

    @Override
    public QuizQuestionDoingExplanation updateExplanation(
        UUID explanationId,
        String explanationContent,
        MultipartFile attachment
    ) {
        QuizQuestionDoingExplanation updatedQuizDoingExplanation = quizDoingExplanationRepo.findById(explanationId)
            .orElseThrow(() -> new ResourceNotFoundException("Doesn't exist quiz doing explanation with id " + explanationId));
        updatedQuizDoingExplanation.setSolutionExplanation(explanationContent);
        setAttachment(updatedQuizDoingExplanation, attachment);
        return quizDoingExplanationRepo.save(updatedQuizDoingExplanation);
    }

    @Override
    public void deleteExplanation(UUID explanationId) {
        QuizQuestionDoingExplanation deletedQuizDoingExplanation = quizDoingExplanationRepo.findById(explanationId)
            .orElseThrow(() -> new ResourceNotFoundException("Doesn't exist quiz doing explanation with id " + explanationId));
        String attachmentStorageId = deletedQuizDoingExplanation.getAttachment();
        quizDoingExplanationRepo.deleteById(explanationId);
        if (attachmentStorageId != null) {
            mongoContentService.deleteFilesById(attachmentStorageId);
        }
    }

    @Override
    public QuizQuestionDoingExplanation setAttachment(QuizQuestionDoingExplanation explanation,
                                                      MultipartFile attachment) {
        if (attachment == null) {
            return explanation;
        }

        try {
            String uniqueFileName = new StringBuilder(UUID.randomUUID().toString())
                .append("_").append(attachment.getOriginalFilename())
                .toString();
            ContentModel contentModel = new ContentModel(uniqueFileName, attachment);
            ObjectId newAttachmentStorageId = mongoContentService.storeFileToGridFs(contentModel);
            String oldAttachmentStorageId = explanation.getAttachment();
            explanation.setAttachment(newAttachmentStorageId.toString());
            mongoContentService.deleteFilesById(oldAttachmentStorageId);
        } catch (IOException e) {
            log.error("An error occur when set attachment for quiz doing explanation with id {}. Error detal: {}",
                      explanation.getId(), e.getMessage());
            throw new RuntimeException(e);
        }
        return explanation;
    }
}
