import styles from "./progress-bar.module.css";
interface Props {
  segments: Array<{ color: string; label: string; percentage: number }>;
  testId?: string;
  displayLabelMinPercentage?: number;
}
export const ProgressBar = ({
  testId,
  segments,
  displayLabelMinPercentage,
}: Props) => {
  return (
    <div data-testid={testId} className={styles.progressBarContainer}>
      <div className={styles.labelPlaceholder} />

      <div className={styles.progressBar}>
        {segments.map((segment, index) => {
          return (
            <>

              <div
                key={index}
                className={styles.progressSegment}
                style={{
                  width: `${segment.percentage}%`,
                  backgroundColor: segment.color,
                }}
                title={segment.label}
              >

                {(displayLabelMinPercentage || 10) < segment.percentage && (<>
                  <span className={styles.timeLabel}>{segment.label}</span>
                </>
                )}
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};
