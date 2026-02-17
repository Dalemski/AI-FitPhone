# Fit-Phone: Improving Sleep and Phone Usage Awareness

## Client

[FitPhone](https://fitphone.nl/)

## Overview

Fit-Phone is a project aimed at helping users improve their sleep quality by understanding the impact of phone usage on sleep. The system emphasizes transparency, explicitly communicating uncertainty levels to ensure users understand both the capabilities and limitations of the predictions before relying on them for behavioral decisions.

## Key Features

-  **Behavioral Awareness**: Highlights the relationship between phone habits and sleep quality.
-  **Personalized Insights**: Adapts predictions to individual users based on their unique patterns.
-  **Ethical Design**: Avoids demographic shortcuts and ensures fairness across diverse user groups.
-  **Continuous Monitoring**: Tracks prediction accuracy, detects emerging biases, and incorporates user feedback to prevent misuse.

## Synthetic Proof-of-Concept Experiment

### Why Synthetic Data?

Due to constraints in collecting real-world sleep data, synthetic data was used to validate the system's technical coherence. This data embeds domain knowledge relationships between phone behavior and sleep quality but does not represent real-world complexity.

### Embedded Assumptions

The synthetic data generator incorporates assumptions such as:

-  Increased screen time before bed reduces sleep quality.
-  Stress negatively impacts sleep quality.
-  Caffeine consumption after 2 PM slightly lowers sleep quality.

### Validation Results

-  **Regression Performance**: Personalized models improved sleep quality prediction accuracy by up to 41.7% in balanced datasets.
-  **Classification Performance**: Personalized models improved sleep class predictions by up to 43.2% in balanced datasets.

## Data Collection Recommendations

-  **Minimum Dataset**: 100 users with 21 nights each (2,100 samples).
-  **Recommended Dataset**: 150-200 users with 28 nights each (4,200-5,600 samples).
-  **Class Balance**: Ensure representation across all sleep quality levels.
-  **Longitudinal Data**: Collect multi-night data per user to enable personalization.

## Ethical Considerations

-  The system is a behavioral awareness tool, not a medical device.
-  Explicitly communicate limitations and avoid overconfidence in predictions.
-  Obtain ethics approval and informed consent for real-world data collection.

## Conclusion

Fit-Phone provides a responsible foundation for understanding the impact of phone usage on sleep. By leveraging personalized insights and ethical design principles, the system aims to empower users to make informed decisions about their habits while maintaining transparency and fairness.
