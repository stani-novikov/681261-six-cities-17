import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { COMMENT_MAX_LENGTH, COMMENT_MIN_LENGTH, RATING_VALUES, ratingTitles } from '../../constant.ts';

type CommentFormProps = {
  onSubmit: (rating: number, comment: string) => Promise<void>;
};


export default function CommentForm({ onSubmit }: CommentFormProps): JSX.Element {
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRating(parseInt(event.target.value, 10));
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (rating === null) {
      toast.error('Пожалуйста, выберите рейтинг.');
      return;
    }

    if (comment.length < COMMENT_MIN_LENGTH) {
      toast.error(`Комментарий должен содержать не менее ${COMMENT_MIN_LENGTH} символов.`);
      return;
    }

    if (comment.length > COMMENT_MAX_LENGTH) {
      toast.error(`Комментарий не должен превышать ${COMMENT_MAX_LENGTH} символов.`);
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(rating, comment);
      setRating(null);
      setComment('');
      toast.success('Ваш комментарий успешно отправлен!');
    } catch (error) {
      toast.error('Ошибка при отправке комментария. Пожалуйста, попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="reviews__form form"
      onSubmit={(event) => {
        event.preventDefault();
        void handleSubmit(event);
      }}
    >
      <label className="reviews__label form__label" htmlFor="review">Ваш отзыв</label>
      <div className="reviews__rating-form form__rating">
        {RATING_VALUES.map((star) => (
          <React.Fragment key={star}>
            <input
              className="form__rating-input visually-hidden"
              name="rating"
              value={star}
              id={`${star}-stars`}
              type="radio"
              onChange={handleRatingChange}
              checked={rating === star}
              required
            />
            <label
              htmlFor={`${star}-stars`}
              className="reviews__rating-label form__rating-label"
              title={ratingTitles[star]}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </React.Fragment>
        ))}
      </div>
      <textarea
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Расскажите, как прошла ваша поездка, что вам понравилось и что можно улучшить"
        value={comment}
        onChange={handleCommentChange}
        minLength={COMMENT_MIN_LENGTH}
        maxLength={COMMENT_MAX_LENGTH}
        disabled={isSubmitting}
        required
      />
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
          Для отправки отзыва, пожалуйста, убедитесь, что вы поставили <span className="reviews__star">рейтинг</span> и
          описали своё пребывание минимум <b className="reviews__text-amount">{COMMENT_MIN_LENGTH} символами</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitting || rating === null || comment.length < COMMENT_MIN_LENGTH || comment.length > COMMENT_MAX_LENGTH}
        >
          Отправить
        </button>
      </div>
    </form>
  );
}
