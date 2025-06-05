
/**
 * Error Analyzer - Enhanced error detection with guided suggestions
 */

export interface TypeScriptError {
  file: string;
  line: number;
  column: number;
  code: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface FixSuggestion {
  description: string;
  impact: 'safe' | 'requires-review' | 'breaking';
  preview: string;
  confidence: number;
  fixCode?: string;
}

export interface ErrorWithSuggestions {
  error: TypeScriptError;
  priority: 'blocking' | 'warning' | 'suggestion';
  suggestions: FixSuggestion[];
  rootCause?: string;
  relatedErrors?: TypeScriptError[];
}

export class ErrorAnalyzer {
  analyzeErrors(errors: TypeScriptError[]): ErrorWithSuggestions[] {
    const analyzedErrors: ErrorWithSuggestions[] = [];
    const processedErrors = new Set<string>();
    
    for (const error of errors) {
      const errorKey = `${error.file}:${error.line}:${error.column}`;
      if (processedErrors.has(errorKey)) continue;
      
      const analyzed = this.analyzeError(error, errors);
      analyzedErrors.push(analyzed);
      
      // Mark related errors as processed
      analyzed.relatedErrors?.forEach(relatedError => {
        const relatedKey = `${relatedError.file}:${relatedError.line}:${relatedError.column}`;
        processedErrors.add(relatedKey);
      });
      
      processedErrors.add(errorKey);
    }
    
    return this.prioritizeErrors(analyzedErrors);
  }

  private analyzeError(error: TypeScriptError, allErrors: TypeScriptError[]): ErrorWithSuggestions {
    const suggestions = this.generateSuggestions(error);
    const relatedErrors = this.findRelatedErrors(error, allErrors);
    const rootCause = this.identifyRootCause(error, relatedErrors);
    const priority = this.determinePriority(error, relatedErrors);
    
    return {
      error,
      priority,
      suggestions,
      rootCause,
      relatedErrors
    };
  }

  private generateSuggestions(error: TypeScriptError): FixSuggestion[] {
    const suggestions: FixSuggestion[] = [];
    
    // Static property access errors
    if (error.message.includes('Did you mean to access the static member')) {
      const match = error.message.match(/Did you mean to access the static member '(.+?)' instead/);
      if (match) {
        suggestions.push({
          description: `Use static property access: ${match[1]}`,
          impact: 'safe',
          preview: `Change 'this.${match[1].split('.')[1]}' to '${match[1]}'`,
          confidence: 0.95,
          fixCode: match[1]
        });
      }
    }
    
    // Type mismatch errors
    if (error.message.includes('is not assignable to parameter of type')) {
      suggestions.push({
        description: 'Add type assertion or validation',
        impact: 'requires-review',
        preview: 'Cast value to expected type or add runtime validation',
        confidence: 0.8
      });
    }
    
    // Missing property errors
    if (error.message.includes('Property') && error.message.includes('does not exist on type')) {
      suggestions.push({
        description: 'Add missing property to interface or check spelling',
        impact: 'requires-review',
        preview: 'Either add the property to the type definition or fix the property name',
        confidence: 0.7
      });
    }
    
    // Import errors
    if (error.message.includes('Cannot find module')) {
      suggestions.push({
        description: 'Fix import path or install missing dependency',
        impact: 'safe',
        preview: 'Correct the import path or add the missing package',
        confidence: 0.9
      });
    }
    
    return suggestions;
  }

  private findRelatedErrors(error: TypeScriptError, allErrors: TypeScriptError[]): TypeScriptError[] {
    const related: TypeScriptError[] = [];
    
    // Find errors with same root cause
    for (const otherError of allErrors) {
      if (otherError === error) continue;
      
      // Same file and similar error type
      if (otherError.file === error.file && 
          this.isSimilarError(error, otherError)) {
        related.push(otherError);
      }
    }
    
    return related;
  }

  private isSimilarError(error1: TypeScriptError, error2: TypeScriptError): boolean {
    // Check if errors are of the same type
    const error1Type = this.getErrorType(error1.message);
    const error2Type = this.getErrorType(error2.message);
    
    return error1Type === error2Type;
  }

  private getErrorType(message: string): string {
    if (message.includes('static member')) return 'static-access';
    if (message.includes('not assignable')) return 'type-mismatch';
    if (message.includes('does not exist on type')) return 'missing-property';
    if (message.includes('Cannot find module')) return 'import-error';
    
    return 'other';
  }

  private identifyRootCause(error: TypeScriptError, relatedErrors: TypeScriptError[]): string {
    const errorType = this.getErrorType(error.message);
    
    switch (errorType) {
      case 'static-access':
        if (relatedErrors.length > 1) {
          return `Multiple static property access errors in ${error.file} - likely copy-paste or pattern issue`;
        }
        return 'Incorrect static property access pattern';
        
      case 'type-mismatch':
        return 'Type definitions may be out of sync with usage';
        
      case 'missing-property':
        return 'Interface definition incomplete or property name mismatch';
        
      case 'import-error':
        return 'File moved, renamed, or dependency missing';
        
      default:
        return 'Unknown root cause - requires manual investigation';
    }
  }

  private determinePriority(error: TypeScriptError, relatedErrors: TypeScriptError[]): 'blocking' | 'warning' | 'suggestion' {
    if (error.severity === 'error') {
      // High priority if it affects multiple files or has many related errors
      if (relatedErrors.length > 2) return 'blocking';
      return 'warning';
    }
    
    return 'suggestion';
  }

  private prioritizeErrors(errors: ErrorWithSuggestions[]): ErrorWithSuggestions[] {
    return errors.sort((a, b) => {
      // Priority order: blocking > warning > suggestion
      const priorityOrder = { blocking: 3, warning: 2, suggestion: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Secondary sort by confidence of fix
      const maxConfidenceA = Math.max(...a.suggestions.map(s => s.confidence));
      const maxConfidenceB = Math.max(...b.suggestions.map(s => s.confidence));
      
      return maxConfidenceB - maxConfidenceA;
    });
  }
}
