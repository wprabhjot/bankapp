package com.bankapp.logging;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.stream.Collectors;

@Component
@Aspect
public class MethodLogger {

    private static final Logger perfLogger = LoggerFactory.getLogger("com.bankapp.logging.performance");
    private static final Logger statusLogger = LoggerFactory.getLogger("com.bankapp.logging.status");

    @Around("@annotation(Loggable)")
    public Object logExecutionTime(ProceedingJoinPoint joinPoint) throws Throwable {
    		
    	System.out.println("yoooo");

        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        String className = signature.getDeclaringType().getSimpleName();
        String methodName = signature.getMethod().getName();
        String fullMethodName = className + "." + methodName;

        String arguments = Arrays.stream(joinPoint.getArgs())
                .map(arg -> arg != null ? arg.toString() : "null")
                .collect(Collectors.joining(", "));

        long startTime = System.currentTimeMillis();

        statusLogger.info("➡️ Entering method: {} with arguments: [{}]", fullMethodName, arguments);

        try {
            Object result = joinPoint.proceed();
            long executionTime = System.currentTimeMillis() - startTime;

            perfLogger.info("✅ Method executed: {} | Execution time: {} ms", fullMethodName, executionTime);

            statusLogger.info("✅ Method executed successfully: {}", fullMethodName);

            return result;

        } catch (Exception ex) {
            long executionTime = System.currentTimeMillis() - startTime;

            statusLogger.error("❌ Exception in method: {} | Execution time: {} ms | Error: {}",
                    fullMethodName, executionTime, ex.getMessage(), ex);

            throw ex;
        }
    }
}
