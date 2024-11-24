import React, { useState, useCallback } from 'react'
import { AnimatePresence, motion, steps } from 'framer-motion'
import { CheckCircle, Circle } from 'lucide-react'
import ShimmerButton from '../ui/shimmer-button'
import { cn } from '@/lib/utils'

interface FieldProps {
  name: string
  type: string
  placeholder: string
}

interface StepProps {
  label: string
  fields?: FieldProps[],
  content: JSX.Element
}



const StepIndicator: React.FC<{ currentStep: number; steps: StepProps[] }> = ({
  currentStep,
  steps,
}) => (
  <div className="flex justify-between">
    {steps.map((step, index) => (
      <div key={step.label} className="flex flex-col items-center">
        <motion.div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            index <= currentStep ? 'bg-green-500/15 text-green-500' : 'bg-secondary'
          }`}
          initial={false}
          animate={{ scale: index === currentStep ? 1.2 : 1 }}
        >
          {index <= currentStep ? (
            <CheckCircle size={20} />
          ) : (
            <Circle size={20} />
          )}
        </motion.div>
        <div className="mt-2 text-sm">{step.label}</div>
      </div>
    ))}
  </div>
)

const ProgressBar: React.FC<{ currentStep: number; totalSteps: number }> = ({
  currentStep,
  totalSteps,
}) => (
  <motion.div
    className="mt-4 h-2 rounded-full bg-green-500"
    initial={{ width: '0%' }}
    animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
  />
)

const ButtonClasses =
  'rounded-2xl bg-red-500 min-w-36 h-12 px-2 py-1 text-sm font-medium text-white'

const NavigationButtons: React.FC<{
  currentStep: number
  totalSteps: number
  handlePrev: () => void
  handleNext: () => void
}> = ({ currentStep, totalSteps, handlePrev, handleNext }) => (
  <div className="flex justify-start">
    {currentStep === 0 ? null : (
      <ShimmerButton onClick={handlePrev} className={ButtonClasses}>
        Previous
      </ShimmerButton>
    )}
    {currentStep === totalSteps - 1 ? null : (
      <ShimmerButton onClick={handleNext} className={cn(ButtonClasses, "ml-auto")}>
        Next
      </ShimmerButton>
    )}
  </div>
)

const Stepper: React.FC<{
    steps: StepProps[]
}> = ({ steps }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [])

  const handlePrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  return (
    <div className="w-[90%] flex flex-col space-y-4 p-6 px-24">
      <StepIndicator currentStep={currentStep} steps={steps} />
      <ProgressBar currentStep={currentStep} totalSteps={steps.length} />
      
        {steps[currentStep].content}
      
      <NavigationButtons
        currentStep={currentStep}
        totalSteps={steps.length}
        handlePrev={handlePrev}
        handleNext={handleNext}
      />
    </div>
  )
}

export default Stepper