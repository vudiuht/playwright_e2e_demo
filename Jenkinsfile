pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.52.0-focal'
        }
    }
    
    parameters {
        choice(name: 'TEST_ENV', choices: ['prod', 'staging', 'dev'], description: 'Test environment')
        booleanParam(name: 'RUN_UI_TESTS', defaultValue: true, description: 'Run UI tests')
        booleanParam(name: 'RUN_API_TESTS', defaultValue: true, description: 'Run API tests')
    }
    
    stages {
        stage('Setup') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('UI Tests') {
            when {
                expression { return params.RUN_UI_TESTS }
            }
            steps {
                sh "TEST_ENV=${params.TEST_ENV} npx playwright test tests/ui/"
            }
        }
        
        stage('API Tests') {
            when {
                expression { return params.RUN_API_TESTS }
            }
            steps {
                sh "TEST_ENV=${params.TEST_ENV} npm run test:api"
            }
        }
    }
    
    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            publishHTML([
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
        }
    }
}