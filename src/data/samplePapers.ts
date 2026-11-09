import { StudyKitResult } from '../types/studyKit';

export interface SamplePaper {
  id: string;
  title: string;
  authors: string;
  year: string;
  venue: string;
  description: string;
  text: string;
  precomputedKit: StudyKitResult;
}

export const SAMPLE_PAPERS: SamplePaper[] = [
  {
    id: 'attention-2017',
    title: 'Attention Is All You Need',
    authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
    year: '2017',
    venue: '31st Conference on Neural Information Processing Systems (NeurIPS 2017), Long Beach, CA, USA',
    description: 'The seminal paper introducing the Transformer architecture, replacing recurrent and convolutional neural networks with multi-head self-attention mechanisms.',
    text: `Attention Is All You Need

Ashish Vaswani*, Google Brain, avaswani@google.com
Noam Shazeer*, Google Brain, noam@google.com
Niki Parmar*, Google Research, nikip@google.com
Jakob Uszkoreit*, Google Research, uszkoreit@google.com
Llion Jones*, Google Research, llion@google.com
Aidan N. Gomez* †, University of Toronto, aidan@cs.toronto.edu
Łukasz Kaiser*, Google Brain, lukaszkaiser@google.com
Illia Polosukhin* ‡, illia.polosukhin@gmail.com

Abstract
The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train. Our model achieves 28.4 BLEU on the WMT 2014 English-to-German translation task, improving over the existing best results, including ensembles, by over 2 BLEU. On the WMT 2014 English-to-French translation task, our model establishes a new single-model state-of-the-art BLEU score of 41.8 after training for 3.5 days on eight GPUs, a small fraction of the training costs of the best models from the literature.

1 Introduction
Recurrent neural networks, notably long short-term memory (LSTM) and gated recurrent neural networks, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation. Numerous efforts have since continued to push the boundaries of recurrent language models and encoder-decoder architectures.
Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning the positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t. This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.

In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output. The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours on eight P100 GPUs.

3 Model Architecture
Most competitive neural sequence transduction models have an encoder-decoder structure. Here, the encoder maps an input sequence of symbol representations (x_1, ..., x_n) to a sequence of continuous representations z = (z_1, ..., z_n). Given z, the decoder then generates an output sequence (y_1, ..., y_m) of symbols one element at a time. At each step the model is auto-regressive, consuming the previously generated symbols as additional input when generating the next.

The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder.

3.2 Attention
An attention function can be described as mapping a query and a set of key-value pairs to an output, where the query, keys, values, and output are all vectors. The output is computed as a weighted sum of the values, where the weight assigned to each value is computed by a compatibility function of the query with the corresponding key.

3.2.1 Scaled Dot-Product Attention
We call our particular attention "Scaled Dot-Product Attention". The input consists of queries and keys of dimension d_k, and values of dimension d_v. We compute the dot products of the query with all keys, divide each by sqrt(d_k), and apply a softmax function to obtain the weights on the values.
Attention(Q, K, V) = softmax( (Q * K^T) / sqrt(d_k) ) * V

3.2.2 Multi-Head Attention
Instead of performing a single attention function with d_model-dimensional queries, keys and values, we found it beneficial to linearly project the queries, keys and values h times with different, learned linear projections to d_k, d_k and d_v dimensions, respectively. On each of these projected versions of queries, keys and values we then perform the attention function in parallel, yielding d_v-dimensional output values. These are concatenated and once again projected, resulting in the final values.
Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions.

3.5 Positional Encoding
Since our model contains no recurrence and no convolution, in order for the model to make use of the order of the sequence, we must inject some information about the relative or absolute position of the tokens in the sequence. To this end, we add "positional encodings" to the input embeddings at the bottoms of the encoder and decoder stacks. We use sine and cosine functions of different frequencies.

5 Training & Results
On the WMT 2014 English-to-German translation task, the big transformer model (Transformer (big)) outperforms the best reported models by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4. Training took 3.5 days on 8 P100 GPUs. On English-to-French, our big model achieves a BLEU score of 41.8, outperforming all previously published single models.`,
    precomputedKit: {
      paperTitle: 'Attention Is All You Need',
      difficulty: 'Medium',
      keyConcepts: [
        {
          concept: 'Self-Attention Mechanism',
          summary: 'Self-attention connects all tokens in a sentence directly to every other token, calculating relationship weights using queries, keys, and values. Instead of stepping through words one by one like older recurrent models, it processes all connections simultaneously. This allows the model to capture long-range linguistic context without losing information across long sequences.',
          whyItMatters: 'Removes the sequential bottleneck that plagued recurrent networks (RNNs/LSTMs), allowing full parallelization during training.'
        },
        {
          concept: 'Scaled Dot-Product Attention',
          summary: 'This mathematical formula measures how relevant a key vector is to a query vector by multiplying them and scaling the product down by the square root of the key dimension. The scaling prevents dot products from growing excessively large for large dimensions, which would push the softmax function into regions with tiny gradients. Finally, the resulting softmax weights multiply the value vectors to produce the attention output.',
          whyItMatters: 'Stabilizes gradients during training for higher-dimensional embeddings where unscaled dot products would stall gradient descent.'
        },
        {
          concept: 'Multi-Head Attention',
          summary: 'Rather than computing a single set of attention weights, the network splits queries, keys, and values across multiple learned subspaces or "heads." Each head focuses on different semantic, grammatical, or contextual relationships at various sentence positions simultaneously. The resulting outputs are concatenated and linearly projected back into the model dimension.',
          whyItMatters: 'Prevents averaging out distinct relationships, letting the model simultaneously track grammatical subject-verb agreement and semantic topicality.'
        },
        {
          concept: 'Sinusoidal Positional Encoding',
          summary: 'Because self-attention contains neither recurrence nor convolution, the model has no innate sense of word order. The authors injected positional information by adding sine and cosine waves of varying frequencies directly to the input token embeddings. This allows the attention mechanism to distinguish between identical words appearing in different parts of a sentence.',
          whyItMatters: 'Preserves critical sequence order without adding recurrent computational steps.'
        }
      ],
      practiceQuestions: {
        difficulty: 'Medium',
        multipleChoice: {
          question: 'Why did the authors divide the dot products of queries and keys by the square root of their dimension (sqrt(d_k)) in Scaled Dot-Product Attention?',
          options: [
            'To ensure the matrix dimensions remain compatible during backpropagation',
            'To counteract large dot product magnitudes that push softmax into regions with vanishingly small gradients',
            'To force the positional encodings to synchronize with the multi-head attention weights',
            'To reduce GPU memory footprint during parallel multi-sequence matrix multiplications'
          ],
          correctIndex: 1,
          explanation: 'As dimension d_k grows large, the dot products grow large in magnitude, which pushes the softmax function into saturation zones with extremely small gradients. Dividing by sqrt(d_k) stabilizes training.'
        },
        shortAnswer: {
          question: 'Explain the fundamental limitation of Recurrent Neural Networks (RNNs) that the Transformer architecture explicitly overcomes, and describe how it achieves this.',
          sampleHighScoringAnswer: 'RNNs are inherently sequential: computing hidden state h_t requires the previous state h_{t-1}, precluding parallel computation within training sequences and slowing training on long documents. The Transformer completely eliminates recurrence by using self-attention to compute relationships between all token positions in parallel across GPU cores, dramatically reducing training time while maintaining global context.',
          keyRubricPoints: [
            'Identifies the sequential time-step dependency of RNN hidden states that blocks parallelization',
            'Explains memory/throughput constraints over long sequences',
            'States that self-attention allows all tokens to attend to each other simultaneously in parallel matrix operations'
          ]
        },
        realWorldApplication: {
          scenario: 'A legal tech company needs to automatically analyze 50-page commercial contracts to verify that indemnity clauses in section 12 correctly reference liabilities defined in section 2.',
          question: 'How does the Transformer\'s multi-head self-attention provide a superior architectural fit for this task compared to traditional LSTM networks?',
          sampleApproach: 'LSTMs suffer from catastrophic forgetting or signal degradation over hundreds of tokens due to sequential hidden state updates. In contrast, multi-head self-attention has an O(1) path length between any two tokens regardless of distance: the queries in section 12 can directly attend to keys in section 2 with no intermediate decay, accurately identifying cross-document obligations.'
        }
      },
      flashcards: [
        {
          front: 'What is the mathematical formula for Scaled Dot-Product Attention?',
          back: 'Attention(Q, K, V) = softmax((Q * K^T) / sqrt(d_k)) * V',
          category: 'Core Formula'
        },
        {
          front: 'What is the primary computational benefit of eliminating recurrence in sequence transduction?',
          back: 'Enables massive parallelization across token positions during training on GPUs, drastically cutting training time.',
          category: 'Architecture'
        },
        {
          front: 'Why does the Transformer require Positional Encoding?',
          back: 'Because self-attention operations are permutation-invariant; without positional encoding, the model cannot distinguish token order.',
          category: 'Mechanism'
        },
        {
          front: 'What BLEU score did the big Transformer achieve on the WMT 2014 English-to-German task?',
          back: '28.4 BLEU, outperforming existing best models and ensembles by over 2 BLEU.',
          category: 'Empirical Results'
        },
        {
          front: 'How long did training the English-to-French Transformer take on 8 GPUs?',
          back: '3.5 days on 8 P100 GPUs.',
          category: 'Empirical Results'
        },
        {
          front: 'What are the three components that define the input to an attention head?',
          back: 'Queries (Q), Keys (K), and Values (V).',
          category: 'Terminology'
        },
        {
          front: 'What role does Multi-Head Attention play compared to single attention?',
          back: 'Allows the model to jointly attend to information from different representation subspaces and positions simultaneously.',
          category: 'Mechanism'
        }
      ],
      metadata: {
        title: 'Attention Is All You Need',
        authors: 'Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin',
        publicationVenue: '31st Conference on Neural Information Processing Systems (NeurIPS 2017)',
        publicationYear: '2017',
        citationCount: 'Unknown',
        disclaimer: 'AI-generated study material should be checked against the source. Extracted facts are limited to the provided paper text.'
      }
    }
  },
  {
    id: 'resnet-2015',
    title: 'Deep Residual Learning for Image Recognition',
    authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
    year: '2015',
    venue: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2016)',
    description: 'The breakthrough vision paper introducing residual shortcut connections, enabling training of networks exceeding 100 layers without degradation.',
    text: `Deep Residual Learning for Image Recognition

Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun
Microsoft Research

Abstract
Deeper neural networks are more difficult to train. We present a residual learning framework to ease the training of networks that are substantially deeper than those used previously. We explicitly reformulate the layers as learning residual functions with reference to the layer inputs, instead of learning unreferenced functions. We provide comprehensive empirical evidence showing that these residual networks are easier to optimize, and can gain accuracy from considerably increased depth. On the ImageNet dataset we evaluate residual nets with a depth of up to 152 layers—8x deeper than VGG nets but still having lower complexity. An ensemble of these residual nets achieves 3.57% error on the ImageNet test set. This result won the 1st place on the ILSVRC 2015 classification task.

1 Introduction
Deep convolutional neural networks have led to a series of breakthroughs for image classification. Driven by the significance of depth, a question arises: Is learning better networks as easy as stacking more layers?
An obstacle to answering this question was the notorious problem of vanishing/exploding gradients, which has been largely addressed by normalized initialization and intermediate normalization layers (e.g. Batch Normalization).
When deeper networks are able to start converging, a degradation problem has been exposed: with the network depth increasing, accuracy gets saturated and then degrades rapidly. Unexpectedly, such degradation is not caused by overfitting, and adding more layers to a suitably deep model leads to higher training error.

The degradation problem indicates that not all systems are similarly easy to optimize. Consider a shallower architecture and its deeper counterpart that adds identity mapping layers. If identity mappings were optimal, a deeper model should produce no higher training error than its shallower counterpart. But experiments show current solvers are unable to find solutions that are comparably good.

In this paper, we address the degradation problem by introducing a deep residual learning framework. Instead of hoping each few stacked layers directly fit a desired underlying mapping H(x), we explicitly let these layers fit a residual mapping F(x) := H(x) - x. The original mapping is recast into F(x) + x. We hypothesize that it is easier to optimize the residual mapping than to optimize the original, unreferenced mapping. To the extreme, if an identity mapping were optimal, it would be easier to push the residual to zero than to fit an identity mapping by a stack of nonlinear layers.

The formulation of F(x) + x can be realized by feedforward neural networks with "shortcut connections" that perform identity mapping. Their outputs are added to the outputs of the stacked layers. Identity shortcut connections add neither extra parameter nor computation complexity.`,
    precomputedKit: {
      paperTitle: 'Deep Residual Learning for Image Recognition',
      difficulty: 'Medium',
      keyConcepts: [
        {
          concept: 'The Degradation Problem',
          summary: 'When traditional deep neural networks grow past a certain depth, their training accuracy saturates and then degrades, performing worse on both training and test data. This is not caused by overfitting, but by mathematical optimization difficulties that prevent gradient descent from finding identity mappings in deep stacks.',
          whyItMatters: 'Revealed that simply stacking more convolutional layers does not yield better representations without architectural changes.'
        },
        {
          concept: 'Residual Mapping Formulation',
          summary: 'Instead of forcing stacked layers to approximate an entire target function H(x), the network is reformulated to learn the residual difference F(x) = H(x) - x. The final output is recovered through an identity shortcut connection adding x back: H(x) = F(x) + x. If identity is the optimal behavior, the solver simply drives the residual weights F(x) toward zero, which is far easier than learning identity from scratch.',
          whyItMatters: 'Transforms a hard nonlinear learning problem into an easier perturbation problem, ensuring deeper networks never perform worse than shallower counterparts.'
        },
        {
          concept: 'Identity Shortcut Connections',
          summary: 'Identity shortcuts are parameter-free pathways that skip one or more layers and add the original input vector directly to the output of the convolutional block. Because they introduce zero extra learned parameters and zero computational overhead beyond an element-wise addition, they allow massive scaling.',
          whyItMatters: 'Enables 100+ layer architectures (e.g., ResNet-152) to train smoothly without exploding model size or memory.'
        }
      ],
      practiceQuestions: {
        difficulty: 'Medium',
        multipleChoice: {
          question: 'According to the paper, what is the primary distinction between the degradation problem and overfitting?',
          options: [
            'Overfitting exhibits high training error, whereas degradation only appears on test splits',
            'Degradation manifests as higher training error in deeper networks, proving it is an optimization failure rather than overfitting',
            'Degradation only occurs when Batch Normalization is omitted from the network architecture',
            'Overfitting can be solved by shortcut connections, while degradation requires dropout layers'
          ],
          correctIndex: 1,
          explanation: 'Overfitting occurs when a model achieves very low training error but high test error. In the degradation problem, the deeper network exhibits higher training error, proving that gradient optimization failed to find good parameters.'
        },
        shortAnswer: {
          question: 'Why is learning the residual mapping F(x) = H(x) - x computationally easier for gradient optimization than learning the original mapping H(x)?',
          sampleHighScoringAnswer: 'If identity mapping is optimal or near-optimal, pushing residual weights F(x) to zero via weight decay or regular gradient steps is trivial for backpropagation. In contrast, forcing a stack of non-linear convolutional and activation layers to learn an exact identity transformation unreferenced from x requires complex parameter coordination that optimizers struggle to reach.',
          keyRubricPoints: [
            'Mentions that driving F(x) to zero is easy for optimizers',
            'Contrasts this with the difficulty of non-linear activations fitting an identity function',
            'Notes that shortcuts allow gradient signals to flow unimpeded directly back through the network'
          ]
        },
        realWorldApplication: {
          scenario: 'A medical imaging hospital needs an automated AI diagnostic pipeline for detecting rare micro-fractures in 2000x2000 high-resolution X-rays.',
          question: 'Why did the introduction of ResNet architectures revolutionize high-resolution medical diagnosis compared to older networks like AlexNet or VGG?',
          sampleApproach: 'Micro-fractures require both ultra-fine local pixel edge features (early layers) and large global anatomical context (deep layers). Shallow models like AlexNet lack the depth to represent both simultaneously, while 150-layer ResNet captures multi-scale abstractions without vanishing gradients, reaching superhuman diagnostic accuracy.'
        }
      },
      flashcards: [
        {
          front: 'What equation defines the Residual Block output?',
          back: 'H(x) = F(x) + x, where F(x) is the residual mapping and x is the identity shortcut.',
          category: 'Core Formula'
        },
        {
          front: 'Do identity shortcut connections add trainable parameters to the network?',
          back: 'No, identity shortcuts perform a direct skip connection with zero additional learned parameters.',
          category: 'Architecture'
        },
        {
          front: 'What top-5 error rate did the ResNet ensemble achieve on ImageNet 2015?',
          back: '3.57% error, securing 1st place in the ILSVRC 2015 classification task.',
          category: 'Empirical Results'
        },
        {
          front: 'How many layers deep was the deepest evaluated ResNet on ImageNet?',
          back: '152 layers (8x deeper than VGG nets with lower complexity).',
          category: 'Architecture'
        },
        {
          front: 'What is the degradation problem in deep networks?',
          back: 'As network depth increases, accuracy saturates and training error unexpectedly increases, caused by optimization difficulty rather than overfitting.',
          category: 'Terminology'
        }
      ],
      metadata: {
        title: 'Deep Residual Learning for Image Recognition',
        authors: 'Kaiming He, Xiangyu Zhang, Shaoqing Ren, Jian Sun',
        publicationVenue: 'IEEE Conference on Computer Vision and Pattern Recognition (CVPR 2016)',
        publicationYear: '2015',
        citationCount: 'Unknown',
        disclaimer: 'AI-generated study material should be checked against the source. Extracted facts are limited to the provided paper text.'
      }
    }
  }
];
