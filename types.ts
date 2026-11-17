import React from 'react';

export enum Sender {
  User = 'user',
  Boss = 'boss',
  System = 'system',
}

export enum MessageType {
  Text = 'text',
  Hint = 'hint',
  WorkOrder = 'workOrder',
  Report = 'report',
  Image = 'image',
}

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string | React.ReactNode;
  timestamp: number;
}

export interface Question {
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correct: string;
  feedback_correct: string;
  feedback_wrong: string;
}

export interface StationData {
  introduction: string;
  questions: Question[];
}

export interface FactoryDataMap {
  [key: string]: StationData;
}

export interface SimulationState {
  isActive: boolean;
  group: string;
  factory: string;
  sessionId: string;
  mood: number;
  stage: number;
  userAnswers: string[];
  answerCorrectness: boolean[];
  isWaitingForAI: boolean;
  isWaitingForHintConfirmation: boolean;
  currentHintQuery: string;
  isFinished: boolean;
}